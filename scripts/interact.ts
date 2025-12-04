import { ethers } from "hardhat";

/**
 * Interaction Script: ConfidentialMedicalRecords
 *
 * Helper script to interact with deployed contract
 * Useful for testing and demonstration
 *
 * Usage:
 * ```bash
 * # Update CONTRACT_ADDRESS below, then run:
 * npx hardhat run scripts/interact.ts --network sepolia
 * ```
 */

// TODO: Update this address after deployment
const CONTRACT_ADDRESS = "0xYourContractAddressHere";

async function main() {
  console.log("🔄 Interacting with ConfidentialMedicalRecords Contract...\n");

  // Get signers
  const [owner, doctor, patient] = await ethers.getSigners();
  console.log("👤 Owner:", owner.address);
  console.log("👨‍⚕️ Doctor:", doctor.address);
  console.log("🤒 Patient:", patient.address);
  console.log();

  // Connect to the deployed contract
  const contract = await ethers.getContractAt(
    "ConfidentialMedicalRecords",
    CONTRACT_ADDRESS
  );

  console.log("📍 Contract Address:", await contract.getAddress());
  console.log();

  try {
    // 1. Authorize Doctor
    console.log("1️⃣ Authorizing doctor...");
    const authTx = await contract.connect(owner).authorizeDoctor(doctor.address);
    await authTx.wait();
    console.log("✅ Doctor authorized\n");

    // 2. Register Patient
    console.log("2️⃣ Registering patient...");
    const emergencyCode = 12345;
    const registerTx = await contract.connect(patient).registerPatient(emergencyCode);
    await registerTx.wait();
    console.log("✅ Patient registered with emergency code:", emergencyCode);
    console.log();

    // 3. Create Medical Record
    console.log("3️⃣ Creating medical record...");
    const bloodType = 3; // B+
    const age = 45;
    const chronicConditions = 2;
    const lastVisitDate = 20240315;

    const createTx = await contract
      .connect(doctor)
      .createMedicalRecord(patient.address, bloodType, age, chronicConditions, lastVisitDate);
    await createTx.wait();
    console.log("✅ Medical record created");
    console.log("   Blood Type: B+");
    console.log("   Age:", age);
    console.log("   Chronic Conditions:", chronicConditions);
    console.log("   Last Visit:", lastVisitDate);
    console.log();

    // 4. View System Stats
    console.log("4️⃣ Fetching system statistics...");
    const stats = await contract.getSystemStats();
    console.log("📊 System Statistics:");
    console.log("   Total Patients:", stats.totalPatients.toString());
    console.log("   Total Records:", stats.totalRecords.toString());
    console.log("   Total Requests:", stats.totalRequests.toString());
    console.log();

    // 5. View Patient Records
    console.log("5️⃣ Viewing patient records...");
    const recordIds = await contract.connect(patient).getPatientRecordIds(patient.address);
    console.log("📋 Patient has", recordIds.length.toString(), "record(s)");

    if (recordIds.length > 0) {
      for (const recordId of recordIds) {
        const recordInfo = await contract.getRecordInfo(recordId);
        console.log(`\n   Record #${recordId}:`);
        console.log("   - Status:", recordInfo.isActive ? "Active" : "Inactive");
        console.log("   - Created by:", recordInfo.authorizedDoctor);
        console.log("   - Timestamp:", new Date(Number(recordInfo.timestamp) * 1000).toLocaleString());
      }
    }
    console.log();

    // 6. Request Access (from another doctor)
    console.log("6️⃣ Requesting access to patient records...");
    const requestTx = await contract.connect(doctor).requestRecordAccess(1, 0); // Patient ID 1, Read access
    await requestTx.wait();
    console.log("✅ Access request created");
    console.log();

    // 7. View Access Request
    console.log("7️⃣ Viewing access request...");
    const requestInfo = await contract.getAccessRequestInfo(1);
    console.log("📝 Access Request #1:");
    console.log("   - Doctor:", requestInfo.doctor);
    console.log("   - Patient ID:", requestInfo.patientId.toString());
    console.log("   - Pending:", requestInfo.isPending);
    console.log("   - Approved:", requestInfo.isApproved);
    console.log("   - Requested:", new Date(Number(requestInfo.requestTime) * 1000).toLocaleString());
    console.log("   - Expires:", new Date(Number(requestInfo.expiryTime) * 1000).toLocaleString());
    console.log();

    console.log("🎉 All interactions completed successfully!");
  } catch (error) {
    console.error("\n❌ Error during interaction:");
    console.error(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
