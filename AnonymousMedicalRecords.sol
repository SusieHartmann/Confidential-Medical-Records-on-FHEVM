// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract AnonymousMedicalRecords is SepoliaConfig {

    address public owner;
    uint32 public nextRecordId;
    uint32 public nextPatientId;

    struct MedicalRecord {
        euint32 patientId;
        euint8 bloodType;
        euint8 age;
        euint8 chronicConditions;
        euint32 lastVisitDate;
        bool isActive;
        uint256 timestamp;
        address authorizedDoctor;
    }

    struct PatientProfile {
        euint32 encryptedPatientId;
        euint8 emergencyCode;
        bool isRegistered;
        uint256 registrationTime;
        address[] authorizedDoctors;
        uint32[] recordIds;
    }

    struct AccessRequest {
        address doctor;
        uint32 patientId;
        euint8 requestType;
        bool isPending;
        bool isApproved;
        uint256 requestTime;
        uint256 expiryTime;
    }

    mapping(uint32 => MedicalRecord) public medicalRecords;
    mapping(address => PatientProfile) public patientProfiles;
    mapping(uint32 => AccessRequest) public accessRequests;
    mapping(address => bool) public authorizedDoctors;
    mapping(address => uint32[]) public doctorPatients;

    uint32 public nextRequestId;

    event PatientRegistered(address indexed patient, uint32 patientId);
    event RecordCreated(uint32 indexed recordId, address indexed doctor);
    event AccessRequested(uint32 indexed requestId, address indexed doctor, uint32 patientId);
    event AccessGranted(uint32 indexed requestId, address indexed doctor, uint32 patientId);
    event AccessRevoked(address indexed doctor, uint32 patientId);
    event EmergencyAccess(address indexed doctor, uint32 patientId, uint8 emergencyCode);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthorizedDoctor() {
        require(authorizedDoctors[msg.sender], "Not authorized doctor");
        _;
    }

    modifier onlyRegisteredPatient() {
        require(patientProfiles[msg.sender].isRegistered, "Patient not registered");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextRecordId = 1;
        nextPatientId = 1;
        nextRequestId = 1;
    }

    function authorizeDoctor(address doctor) external onlyOwner {
        authorizedDoctors[doctor] = true;
    }

    function revokeDoctor(address doctor) external onlyOwner {
        authorizedDoctors[doctor] = false;
    }

    function registerPatient(uint8 _emergencyCode) external {
        require(!patientProfiles[msg.sender].isRegistered, "Patient already registered");

        euint32 encryptedPatientId = FHE.asEuint32(nextPatientId);
        euint8 encryptedEmergencyCode = FHE.asEuint8(_emergencyCode);

        patientProfiles[msg.sender] = PatientProfile({
            encryptedPatientId: encryptedPatientId,
            emergencyCode: encryptedEmergencyCode,
            isRegistered: true,
            registrationTime: block.timestamp,
            authorizedDoctors: new address[](0),
            recordIds: new uint32[](0)
        });

        FHE.allowThis(encryptedPatientId);
        FHE.allowThis(encryptedEmergencyCode);
        FHE.allow(encryptedPatientId, msg.sender);
        FHE.allow(encryptedEmergencyCode, msg.sender);

        emit PatientRegistered(msg.sender, nextPatientId);
        nextPatientId++;
    }

    function createMedicalRecord(
        address patient,
        uint8 _bloodType,
        uint8 _age,
        uint8 _chronicConditions,
        uint32 _lastVisitDate
    ) external onlyAuthorizedDoctor {
        require(patientProfiles[patient].isRegistered, "Patient not registered");
        require(_bloodType <= 8, "Invalid blood type"); // A+, A-, B+, B-, AB+, AB-, O+, O-
        require(_age <= 150, "Invalid age");
        require(_chronicConditions <= 10, "Invalid chronic conditions count");

        euint32 encryptedPatientId = patientProfiles[patient].encryptedPatientId;
        euint8 encryptedBloodType = FHE.asEuint8(_bloodType);
        euint8 encryptedAge = FHE.asEuint8(_age);
        euint8 encryptedConditions = FHE.asEuint8(_chronicConditions);
        euint32 encryptedVisitDate = FHE.asEuint32(_lastVisitDate);

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

        patientProfiles[patient].recordIds.push(nextRecordId);
        doctorPatients[msg.sender].push(nextRecordId);

        FHE.allowThis(encryptedBloodType);
        FHE.allowThis(encryptedAge);
        FHE.allowThis(encryptedConditions);
        FHE.allowThis(encryptedVisitDate);
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

    function requestRecordAccess(
        uint32 patientId,
        uint8 _requestType
    ) external onlyAuthorizedDoctor {
        require(_requestType <= 3, "Invalid request type"); // 0: Read, 1: Update, 2: Emergency, 3: Research

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

    function approveAccess(uint32 requestId) external onlyRegisteredPatient {
        AccessRequest storage request = accessRequests[requestId];
        require(request.isPending, "Request not pending");
        require(block.timestamp < request.expiryTime, "Request expired");

        request.isPending = false;
        request.isApproved = true;

        patientProfiles[msg.sender].authorizedDoctors.push(request.doctor);

        emit AccessGranted(requestId, request.doctor, request.patientId);
    }

    function emergencyAccess(
        uint32 patientId,
        uint8 _emergencyCode
    ) external onlyAuthorizedDoctor {
        euint8 encryptedEmergencyCode = FHE.asEuint8(_emergencyCode);

        FHE.allowThis(encryptedEmergencyCode);

        emit EmergencyAccess(msg.sender, patientId, _emergencyCode);
    }

    function revokeAccess(address doctor) external onlyRegisteredPatient {
        address[] storage authorizedDocs = patientProfiles[msg.sender].authorizedDoctors;
        for (uint i = 0; i < authorizedDocs.length; i++) {
            if (authorizedDocs[i] == doctor) {
                authorizedDocs[i] = authorizedDocs[authorizedDocs.length - 1];
                authorizedDocs.pop();
                break;
            }
        }

        emit AccessRevoked(doctor, nextPatientId);
    }

    function getPatientRecordCount(address patient) external view returns (uint256) {
        return patientProfiles[patient].recordIds.length;
    }

    function getPatientRecordIds(address patient) external view returns (uint32[] memory) {
        require(
            msg.sender == patient ||
            authorizedDoctors[msg.sender],
            "Not authorized to view records"
        );
        return patientProfiles[patient].recordIds;
    }

    function getDoctorPatients(address doctor) external view returns (uint32[] memory) {
        require(msg.sender == doctor || msg.sender == owner, "Not authorized");
        return doctorPatients[doctor];
    }

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

    function isPatientRegistered(address patient) external view returns (bool) {
        return patientProfiles[patient].isRegistered;
    }

    function isDoctorAuthorized(address doctor) external view returns (bool) {
        return authorizedDoctors[doctor];
    }

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

    function updateRecordStatus(uint32 recordId, bool isActive) external {
        MedicalRecord storage record = medicalRecords[recordId];
        require(
            msg.sender == record.authorizedDoctor || msg.sender == owner,
            "Not authorized to update record"
        );
        record.isActive = isActive;
    }

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