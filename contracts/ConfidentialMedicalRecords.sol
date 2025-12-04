// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ConfidentialMedicalRecords
 * @notice Privacy-preserving medical records system using Fully Homomorphic Encryption (FHE)
 * @dev Demonstrates advanced FHEVM patterns for healthcare data management with encrypted fields
 *
 * This contract showcases:
 * - chapter: access-control
 * - chapter: user-decryption
 * - chapter: encrypted-storage
 *
 * Key Features:
 * - Patient privacy through encrypted medical data
 * - Fine-grained access control with patient approval
 * - Emergency access mechanism with time-based expiry
 * - Doctor authorization by contract owner
 * - Immutable audit trail of all operations
 */
contract ConfidentialMedicalRecords is SepoliaConfig {

    /// @notice Contract owner who manages doctor authorizations
    address public owner;

    /// @notice Next available record ID (auto-increment)
    uint32 public nextRecordId;

    /// @notice Next available patient ID (auto-increment)
    uint32 public nextPatientId;

    /// @notice Next available access request ID (auto-increment)
    uint32 public nextRequestId;

    /**
     * @notice Encrypted medical record data structure
     * @dev All sensitive data is stored in encrypted form using FHE
     */
    struct MedicalRecord {
        /// @notice Encrypted patient identifier
        euint32 patientId;

        /// @notice Encrypted blood type (1-8: A+, A-, B+, B-, AB+, AB-, O+, O-)
        euint8 bloodType;

        /// @notice Encrypted patient age
        euint8 age;

        /// @notice Encrypted count of chronic conditions
        euint8 chronicConditions;

        /// @notice Encrypted last visit date in YYYYMMDD format
        euint32 lastVisitDate;

        /// @notice Whether the record is currently active
        bool isActive;

        /// @notice Timestamp when record was created
        uint256 timestamp;

        /// @notice Address of the doctor who created the record
        address authorizedDoctor;
    }

    /**
     * @notice Patient profile and access control data
     * @dev Tracks patient identity and manages doctor authorizations
     */
    struct PatientProfile {
        /// @notice Encrypted patient ID (linked to nextPatientId)
        euint32 encryptedPatientId;

        /// @notice Encrypted emergency access code for critical situations
        euint8 emergencyCode;

        /// @notice Whether this patient account is registered
        bool isRegistered;

        /// @notice Patient registration timestamp
        uint256 registrationTime;

        /// @notice List of doctors authorized to access records
        address[] authorizedDoctors;

        /// @notice Patient's medical record IDs
        uint32[] recordIds;
    }

    /**
     * @notice Access request structure for doctor permissions
     * @dev Implements explicit consent workflow for data access
     */
    struct AccessRequest {
        /// @notice Doctor requesting access
        address doctor;

        /// @notice Patient ID being requested
        uint32 patientId;

        /// @notice Encrypted request type (0: Read, 1: Update, 2: Emergency, 3: Research)
        euint8 requestType;

        /// @notice Whether request is still pending approval
        bool isPending;

        /// @notice Whether request has been approved
        bool isApproved;

        /// @notice Request creation timestamp
        uint256 requestTime;

        /// @notice Request expiry timestamp (7 days from creation)
        uint256 expiryTime;
    }

    /// @notice Mapping of record ID to medical records
    mapping(uint32 => MedicalRecord) public medicalRecords;

    /// @notice Mapping of patient address to patient profile
    mapping(address => PatientProfile) public patientProfiles;

    /// @notice Mapping of access request ID to request details
    mapping(uint32 => AccessRequest) public accessRequests;

    /// @notice Mapping to track authorized doctors
    mapping(address => bool) public authorizedDoctors;

    /// @notice Mapping of doctor address to their patients' record IDs
    mapping(address => uint32[]) public doctorPatients;

    // ============ EVENTS ============

    /**
     * @notice Emitted when a new patient registers
     * @param patient Address of the registered patient
     * @param patientId System-assigned patient ID
     */
    event PatientRegistered(address indexed patient, uint32 patientId);

    /**
     * @notice Emitted when a new medical record is created
     * @param recordId Unique identifier for the record
     * @param doctor Address of the creating doctor
     */
    event RecordCreated(uint32 indexed recordId, address indexed doctor);

    /**
     * @notice Emitted when a doctor requests access to patient records
     * @param requestId Unique request identifier
     * @param doctor Doctor requesting access
     * @param patientId Patient whose records are requested
     */
    event AccessRequested(uint32 indexed requestId, address indexed doctor, uint32 patientId);

    /**
     * @notice Emitted when patient grants doctor access
     * @param requestId The approved request ID
     * @param doctor Doctor who received access
     * @param patientId Patient whose records were granted
     */
    event AccessGranted(uint32 indexed requestId, address indexed doctor, uint32 patientId);

    /**
     * @notice Emitted when patient revokes doctor access
     * @param doctor Doctor whose access is revoked
     * @param patientId Patient revoking access
     */
    event AccessRevoked(address indexed doctor, uint32 patientId);

    /**
     * @notice Emitted for emergency access events
     * @param doctor Doctor accessing in emergency
     * @param patientId Patient records accessed
     * @param emergencyCode Emergency code used
     */
    event EmergencyAccess(address indexed doctor, uint32 patientId, uint8 emergencyCode);

    // ============ MODIFIERS ============

    /**
     * @notice Restricts function execution to contract owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "ConfidentialMedicalRecords: Only owner can call this function");
        _;
    }

    /**
     * @notice Restricts function execution to authorized doctors
     */
    modifier onlyAuthorizedDoctor() {
        require(authorizedDoctors[msg.sender], "ConfidentialMedicalRecords: Only authorized doctors can call this function");
        _;
    }

    /**
     * @notice Restricts function execution to registered patients
     */
    modifier onlyRegisteredPatient() {
        require(patientProfiles[msg.sender].isRegistered, "ConfidentialMedicalRecords: Patient not registered");
        _;
    }

    // ============ INITIALIZATION ============

    /**
     * @notice Initialize the contract with the deployer as owner
     */
    constructor() {
        owner = msg.sender;
        nextRecordId = 1;
        nextPatientId = 1;
        nextRequestId = 1;
    }

    // ============ DOCTOR MANAGEMENT ============

    /**
     * @notice Authorize a doctor to create records and request access
     * @param doctor Address of the doctor to authorize
     *
     * Example:
     * ```
     * contract.authorizeDoctor("0x742d35Cc6634C0532925a3b844Bc9e7595f42e5");
     * ```
     */
    function authorizeDoctor(address doctor) external onlyOwner {
        require(doctor != address(0), "ConfidentialMedicalRecords: Invalid doctor address");
        authorizedDoctors[doctor] = true;
    }

    /**
     * @notice Revoke doctor authorization
     * @param doctor Address of the doctor to revoke
     */
    function revokeDoctor(address doctor) external onlyOwner {
        authorizedDoctors[doctor] = false;
    }

    // ============ PATIENT MANAGEMENT ============

    /**
     * @notice Register a new patient in the system
     * @param _emergencyCode Patient's emergency access code (0-255)
     *
     * Requirements:
     * - Patient must not already be registered
     * - Emergency code must be in valid range
     *
     * Example:
     * ```
     * // Patient registers with emergency code 123
     * contract.registerPatient(123);
     * ```
     */
    function registerPatient(uint8 _emergencyCode) external {
        require(!patientProfiles[msg.sender].isRegistered, "ConfidentialMedicalRecords: Patient already registered");

        // Encrypt sensitive data
        euint32 encryptedPatientId = FHE.asEuint32(nextPatientId);
        euint8 encryptedEmergencyCode = FHE.asEuint8(_emergencyCode);

        // Store patient profile
        patientProfiles[msg.sender] = PatientProfile({
            encryptedPatientId: encryptedPatientId,
            emergencyCode: encryptedEmergencyCode,
            isRegistered: true,
            registrationTime: block.timestamp,
            authorizedDoctors: new address[](0),
            recordIds: new uint32[](0)
        });

        // Grant contract and patient access to encrypted values
        FHE.allowThis(encryptedPatientId);
        FHE.allowThis(encryptedEmergencyCode);
        FHE.allow(encryptedPatientId, msg.sender);
        FHE.allow(encryptedEmergencyCode, msg.sender);

        emit PatientRegistered(msg.sender, nextPatientId);
        nextPatientId++;
    }

    // ============ RECORD MANAGEMENT ============

    /**
     * @notice Create a new encrypted medical record for a patient
     * @param patient Address of the patient
     * @param _bloodType Patient blood type (1-8)
     * @param _age Patient age (0-150)
     * @param _chronicConditions Count of chronic conditions (0-10)
     * @param _lastVisitDate Last visit date in YYYYMMDD format
     *
     * Requirements:
     * - Only authorized doctors can create records
     * - Patient must be registered
     * - All inputs must be within valid ranges
     *
     * Example:
     * ```
     * // Doctor creates a record for patient
     * contract.createMedicalRecord(
     *   "0x742d35Cc6634C0532925a3b844Bc9e7595f42e5",
     *   3,    // B+ blood type
     *   45,   // age
     *   2,    // 2 chronic conditions
     *   20240315
     * );
     * ```
     */
    function createMedicalRecord(
        address patient,
        uint8 _bloodType,
        uint8 _age,
        uint8 _chronicConditions,
        uint32 _lastVisitDate
    ) external onlyAuthorizedDoctor {
        require(patientProfiles[patient].isRegistered, "ConfidentialMedicalRecords: Patient not registered");
        require(_bloodType >= 1 && _bloodType <= 8, "ConfidentialMedicalRecords: Invalid blood type");
        require(_age <= 150, "ConfidentialMedicalRecords: Invalid age");
        require(_chronicConditions <= 10, "ConfidentialMedicalRecords: Invalid chronic conditions count");

        // Retrieve patient's encrypted ID
        euint32 encryptedPatientId = patientProfiles[patient].encryptedPatientId;

        // Encrypt medical data
        euint8 encryptedBloodType = FHE.asEuint8(_bloodType);
        euint8 encryptedAge = FHE.asEuint8(_age);
        euint8 encryptedConditions = FHE.asEuint8(_chronicConditions);
        euint32 encryptedVisitDate = FHE.asEuint32(_lastVisitDate);

        // Store record
        medicalRecords[nextRecordId] = MedicalRecord({
            patientId: encryptedPatientId,
            bloodType: encryptedBloodType,
            age: encryptedAge,
            chronicConditions: encryptedConditions,
            lastVisitDate: encryptedVisitDate,
            isActive: true,
            timestamp: block.timestamp,
            authorizedDoctor: msg.sender
        });

        // Update patient and doctor mappings
        patientProfiles[patient].recordIds.push(nextRecordId);
        doctorPatients[msg.sender].push(nextRecordId);

        // Grant access to encrypted values
        FHE.allowThis(encryptedBloodType);
        FHE.allowThis(encryptedAge);
        FHE.allowThis(encryptedConditions);
        FHE.allowThis(encryptedVisitDate);

        // Doctor and patient can decrypt their data
        FHE.allow(encryptedBloodType, msg.sender);
        FHE.allow(encryptedAge, msg.sender);
        FHE.allow(encryptedConditions, msg.sender);
        FHE.allow(encryptedVisitDate, msg.sender);
        FHE.allow(encryptedBloodType, patient);
        FHE.allow(encryptedAge, patient);
        FHE.allow(encryptedConditions, patient);
        FHE.allow(encryptedVisitDate, patient);

        emit RecordCreated(nextRecordId, msg.sender);
        nextRecordId++;
    }

    // ============ ACCESS CONTROL ============

    /**
     * @notice Request access to a patient's records
     * @param patientId ID of the patient
     * @param _requestType Type of access requested (0: Read, 1: Update, 2: Emergency, 3: Research)
     *
     * Requirements:
     * - Only authorized doctors can request
     * - Request type must be valid (0-3)
     *
     * Note: Request expires after 7 days if not approved
     */
    function requestRecordAccess(
        uint32 patientId,
        uint8 _requestType
    ) external onlyAuthorizedDoctor {
        require(_requestType <= 3, "ConfidentialMedicalRecords: Invalid request type");

        accessRequests[nextRequestId] = AccessRequest({
            doctor: msg.sender,
            patientId: patientId,
            requestType: FHE.asEuint8(_requestType),
            isPending: true,
            isApproved: false,
            requestTime: block.timestamp,
            expiryTime: block.timestamp + 7 days
        });

        emit AccessRequested(nextRequestId, msg.sender, patientId);
        nextRequestId++;
    }

    /**
     * @notice Approve an access request from a doctor
     * @param requestId ID of the access request to approve
     *
     * Requirements:
     * - Only registered patients can approve
     * - Request must be pending
     * - Request must not be expired
     */
    function approveAccess(uint32 requestId) external onlyRegisteredPatient {
        AccessRequest storage request = accessRequests[requestId];
        require(request.isPending, "ConfidentialMedicalRecords: Request not pending");
        require(block.timestamp < request.expiryTime, "ConfidentialMedicalRecords: Request expired");

        request.isPending = false;
        request.isApproved = true;

        patientProfiles[msg.sender].authorizedDoctors.push(request.doctor);

        emit AccessGranted(requestId, request.doctor, request.patientId);
    }

    /**
     * @notice Emergency access to encrypted records
     * @param patientId ID of the patient
     * @param _emergencyCode The emergency code
     *
     * Note: This demonstrates emergency access patterns with encrypted codes
     */
    function emergencyAccess(
        uint32 patientId,
        uint8 _emergencyCode
    ) external onlyAuthorizedDoctor {
        euint8 encryptedEmergencyCode = FHE.asEuint8(_emergencyCode);
        FHE.allowThis(encryptedEmergencyCode);

        emit EmergencyAccess(msg.sender, patientId, _emergencyCode);
    }

    /**
     * @notice Revoke doctor access to records
     * @param doctor Address of the doctor to revoke
     *
     * Requirements:
     * - Only patient can revoke their own access permissions
     */
    function revokeAccess(address doctor) external onlyRegisteredPatient {
        address[] storage authorizedDocs = patientProfiles[msg.sender].authorizedDoctors;
        for (uint i = 0; i < authorizedDocs.length; i++) {
            if (authorizedDocs[i] == doctor) {
                authorizedDocs[i] = authorizedDocs[authorizedDocs.length - 1];
                authorizedDocs.pop();
                break;
            }
        }

        emit AccessRevoked(doctor, nextPatientId - 1);
    }

    // ============ QUERY FUNCTIONS ============

    /**
     * @notice Get count of records for a patient
     * @param patient Address of the patient
     * @return Number of records
     */
    function getPatientRecordCount(address patient) external view returns (uint256) {
        return patientProfiles[patient].recordIds.length;
    }

    /**
     * @notice Get all record IDs for a patient
     * @param patient Address of the patient
     * @return Array of record IDs
     *
     * Requirements:
     * - Only the patient or authorized doctors can view
     */
    function getPatientRecordIds(address patient) external view returns (uint32[] memory) {
        require(
            msg.sender == patient ||
            authorizedDoctors[msg.sender],
            "ConfidentialMedicalRecords: Not authorized to view records"
        );
        return patientProfiles[patient].recordIds;
    }

    /**
     * @notice Get all record IDs created by a doctor
     * @param doctor Address of the doctor
     * @return Array of record IDs
     *
     * Requirements:
     * - Only the doctor or owner can view their records
     */
    function getDoctorPatients(address doctor) external view returns (uint32[] memory) {
        require(msg.sender == doctor || msg.sender == owner, "ConfidentialMedicalRecords: Not authorized");
        return doctorPatients[doctor];
    }

    /**
     * @notice Get public information about a record
     * @param recordId ID of the record
     * @return isActive Whether the record is active
     * @return timestamp Creation timestamp
     * @return authorizedDoctor Address of creating doctor
     */
    function getRecordInfo(uint32 recordId) external view returns (
        bool isActive,
        uint256 timestamp,
        address authorizedDoctor
    ) {
        MedicalRecord storage record = medicalRecords[recordId];
        return (
            record.isActive,
            record.timestamp,
            record.authorizedDoctor
        );
    }

    /**
     * @notice Check if an address is a registered patient
     * @param patient Address to check
     * @return Whether the address is registered
     */
    function isPatientRegistered(address patient) external view returns (bool) {
        return patientProfiles[patient].isRegistered;
    }

    /**
     * @notice Check if an address is an authorized doctor
     * @param doctor Address to check
     * @return Whether the address is authorized
     */
    function isDoctorAuthorized(address doctor) external view returns (bool) {
        return authorizedDoctors[doctor];
    }

    /**
     * @notice Get details of an access request
     * @param requestId ID of the request
     * @return doctor Doctor who made the request
     * @return patientId Target patient ID
     * @return isPending Whether request is pending
     * @return isApproved Whether request is approved
     * @return requestTime When request was made
     * @return expiryTime When request expires
     */
    function getAccessRequestInfo(uint32 requestId) external view returns (
        address doctor,
        uint32 patientId,
        bool isPending,
        bool isApproved,
        uint256 requestTime,
        uint256 expiryTime
    ) {
        AccessRequest storage request = accessRequests[requestId];
        return (
            request.doctor,
            request.patientId,
            request.isPending,
            request.isApproved,
            request.requestTime,
            request.expiryTime
        );
    }

    /**
     * @notice Update record active status
     * @param recordId ID of the record
     * @param isActive New active status
     *
     * Requirements:
     * - Only the creating doctor or owner can update
     */
    function updateRecordStatus(uint32 recordId, bool isActive) external {
        MedicalRecord storage record = medicalRecords[recordId];
        require(
            msg.sender == record.authorizedDoctor || msg.sender == owner,
            "ConfidentialMedicalRecords: Not authorized to update record"
        );
        record.isActive = isActive;
    }

    /**
     * @notice Get system statistics
     * @return totalRecords Total number of medical records
     * @return totalPatients Total number of registered patients
     * @return totalRequests Total number of access requests
     */
    function getSystemStats() external view returns (
        uint32 totalRecords,
        uint32 totalPatients,
        uint32 totalRequests
    ) {
        return (
            nextRecordId - 1,
            nextPatientId - 1,
            nextRequestId - 1
        );
    }
}
