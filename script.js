// Anonymous Medical Records DApp
const CONTRACT_ADDRESS = "0x5344e629D343d717Ad15E114d560dc1d07A7465e"; // Anonymous Medical Records contract address
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint32",
                "name": "requestId",
                "type": "uint32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "patientId",
                "type": "uint32"
            }
        ],
        "name": "AccessGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint32",
                "name": "requestId",
                "type": "uint32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "patientId",
                "type": "uint32"
            }
        ],
        "name": "AccessRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "patientId",
                "type": "uint32"
            }
        ],
        "name": "AccessRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "patientId",
                "type": "uint32"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "emergencyCode",
                "type": "uint8"
            }
        ],
        "name": "EmergencyAccess",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "patient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "patientId",
                "type": "uint32"
            }
        ],
        "name": "PatientRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint32",
                "name": "recordId",
                "type": "uint32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            }
        ],
        "name": "RecordCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "name": "accessRequests",
        "outputs": [
            {
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            },
            {
                "internalType": "uint32",
                "name": "patientId",
                "type": "uint32"
            },
            {
                "internalType": "bool",
                "name": "isPending",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isApproved",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "requestTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expiryTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "requestId",
                "type": "uint32"
            }
        ],
        "name": "approveAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            }
        ],
        "name": "authorizeDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "authorizedDoctors",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "patient",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "_bloodType",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_age",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_chronicConditions",
                "type": "uint8"
            },
            {
                "internalType": "uint32",
                "name": "_lastVisitDate",
                "type": "uint32"
            }
        ],
        "name": "createMedicalRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "doctorPatients",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "patientId",
                "type": "uint32"
            },
            {
                "internalType": "uint8",
                "name": "_emergencyCode",
                "type": "uint8"
            }
        ],
        "name": "emergencyAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "requestId",
                "type": "uint32"
            }
        ],
        "name": "getAccessRequestInfo",
        "outputs": [
            {
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            },
            {
                "internalType": "uint32",
                "name": "patientId",
                "type": "uint32"
            },
            {
                "internalType": "bool",
                "name": "isPending",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isApproved",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "requestTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expiryTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            }
        ],
        "name": "getDoctorPatients",
        "outputs": [
            {
                "internalType": "uint32[]",
                "name": "",
                "type": "uint32[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "patient",
                "type": "address"
            }
        ],
        "name": "getPatientRecordCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "patient",
                "type": "address"
            }
        ],
        "name": "getPatientRecordIds",
        "outputs": [
            {
                "internalType": "uint32[]",
                "name": "",
                "type": "uint32[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "recordId",
                "type": "uint32"
            }
        ],
        "name": "getRecordInfo",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "authorizedDoctor",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSystemStats",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "totalRecords",
                "type": "uint32"
            },
            {
                "internalType": "uint32",
                "name": "totalPatients",
                "type": "uint32"
            },
            {
                "internalType": "uint32",
                "name": "totalRequests",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            }
        ],
        "name": "isDoctorAuthorized",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "patient",
                "type": "address"
            }
        ],
        "name": "isPatientRegistered",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "name": "medicalRecords",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "authorizedDoctor",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextPatientId",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextRecordId",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextRequestId",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "patientProfiles",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "registrationTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_emergencyCode",
                "type": "uint8"
            }
        ],
        "name": "registerPatient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "patientId",
                "type": "uint32"
            },
            {
                "internalType": "uint8",
                "name": "_requestType",
                "type": "uint8"
            }
        ],
        "name": "requestRecordAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            }
        ],
        "name": "revokeAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            }
        ],
        "name": "revokeDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "recordId",
                "type": "uint32"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "name": "updateRecordStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Global variables
let provider;
let signer;
let contract;
let currentAccount;

// Initialize the DApp
async function init() {
    console.log("Initializing Anonymous Medical Records DApp...");

    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        // Set up event listeners
        setupEventListeners();

        // Check if already connected
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.log('Error checking existing accounts:', error);
        }
    } else {
        showStatus('Please install MetaMask to use this DApp', 'error');
    }
}

// Set up event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');

    const connectButton = document.getElementById('connectWallet');
    if (connectButton) {
        connectButton.addEventListener('click', function(e) {
            console.log('Connect wallet button clicked!');
            e.preventDefault();
            connectWallet();
        });
        console.log('Connect wallet event listener added');
    } else {
        console.error('Connect wallet button not found!');
    }

    document.getElementById('registerPatient').addEventListener('click', registerPatient);
    document.getElementById('createRecord').addEventListener('click', createMedicalRecord);
    document.getElementById('requestAccess').addEventListener('click', requestAccess);
    document.getElementById('emergencyAccess').addEventListener('click', emergencyAccess);
    document.getElementById('approveAccess').addEventListener('click', approveAccess);
    document.getElementById('getStats').addEventListener('click', getSystemStats);
    document.getElementById('viewRecords').addEventListener('click', viewRecords);

    // Listen for account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
    }
}

// Connect wallet
async function connectWallet() {
    try {
        console.log('connectWallet function called');
        showStatus('Connecting to wallet...', 'info');

        // Check if MetaMask is available
        if (typeof window.ethereum === 'undefined') {
            showStatus('MetaMask is not installed. Please install MetaMask to continue.', 'error');
            return;
        }

        console.log('MetaMask is available, requesting accounts...');

        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        console.log('Accounts received:', accounts);

        if (accounts.length === 0) {
            showStatus('No accounts found. Please connect your MetaMask wallet.', 'error');
            return;
        }

        // Set up provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        currentAccount = accounts[0];

        console.log('Current account:', currentAccount);

        // Get network info
        const network = await provider.getNetwork();
        console.log('Connected to network:', network);

        // Initialize contract
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        console.log('Contract initialized');

        // Update UI
        await updateWalletInfo();
        enableButtons();

        showStatus(`Wallet connected successfully! Network: ${network.name || 'Unknown'} (Chain ID: ${network.chainId})`, 'success');

        // Load initial data (optional, don't fail if contract doesn't exist)
        try {
            await getSystemStats();
        } catch (error) {
            console.log('Could not load system stats, contract may not be deployed:', error.message);
            showStatus('Wallet connected! Note: Contract may not be deployed on this network.', 'info');
        }

    } catch (error) {
        console.error('Error connecting wallet:', error);
        showStatus('Failed to connect wallet: ' + error.message, 'error');
    }
}

// Update wallet information
async function updateWalletInfo() {
    document.getElementById('connectedAddress').textContent = currentAccount;

    // Update network info
    try {
        const network = await provider.getNetwork();
        document.getElementById('networkInfo').textContent = `${network.name || 'Unknown'} (Chain ID: ${network.chainId})`;
    } catch (error) {
        document.getElementById('networkInfo').textContent = 'Network info unavailable';
    }

    document.getElementById('walletInfo').classList.remove('hidden');
    document.getElementById('connectWallet').textContent = 'Wallet Connected';
    document.getElementById('connectWallet').disabled = true;
}

// Enable buttons after wallet connection
function enableButtons() {
    const buttons = ['registerPatient', 'createRecord', 'requestAccess', 'emergencyAccess', 'approveAccess', 'getStats', 'viewRecords'];
    buttons.forEach(id => {
        document.getElementById(id).disabled = false;
    });
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected
        location.reload();
    } else {
        // User switched accounts
        currentAccount = accounts[0];
        updateWalletInfo();
    }
}

// Handle chain changes
function handleChainChanged(chainId) {
    location.reload();
}

// Register patient
async function registerPatient() {
    try {
        const emergencyCode = document.getElementById('emergencyCode').value;

        if (!emergencyCode || emergencyCode < 0 || emergencyCode > 255) {
            showStatus('Please enter a valid emergency code (0-255)', 'error');
            return;
        }

        showStatus('Registering patient...', 'info');
        setButtonLoading('registerPatient', true);

        const tx = await contract.registerPatient(parseInt(emergencyCode));
        await tx.wait();

        showStatus('Patient registered successfully!', 'success');

        // Clear form
        document.getElementById('emergencyCode').value = '';

    } catch (error) {
        console.error('Error registering patient:', error);
        showStatus('Failed to register patient: ' + error.message, 'error');
    } finally {
        setButtonLoading('registerPatient', false);
    }
}

// Create medical record
async function createMedicalRecord() {
    try {
        const patientAddress = document.getElementById('patientAddress').value;
        const bloodType = document.getElementById('bloodType').value;
        const age = document.getElementById('age').value;
        const chronicConditions = document.getElementById('chronicConditions').value;
        const lastVisitDate = document.getElementById('lastVisitDate').value;

        if (!ethers.utils.isAddress(patientAddress)) {
            showStatus('Please enter a valid patient address', 'error');
            return;
        }

        if (!age || age < 0 || age > 150) {
            showStatus('Please enter a valid age (0-150)', 'error');
            return;
        }

        if (!chronicConditions || chronicConditions < 0 || chronicConditions > 10) {
            showStatus('Please enter valid chronic conditions count (0-10)', 'error');
            return;
        }

        if (!lastVisitDate || lastVisitDate.length !== 8) {
            showStatus('Please enter a valid date (YYYYMMDD format)', 'error');
            return;
        }

        showStatus('Creating medical record...', 'info');
        setButtonLoading('createRecord', true);

        const tx = await contract.createMedicalRecord(
            patientAddress,
            parseInt(bloodType),
            parseInt(age),
            parseInt(chronicConditions),
            parseInt(lastVisitDate)
        );
        await tx.wait();

        showStatus('Medical record created successfully!', 'success');

        // Clear form
        document.getElementById('patientAddress').value = '';
        document.getElementById('age').value = '';
        document.getElementById('chronicConditions').value = '';
        document.getElementById('lastVisitDate').value = '';

    } catch (error) {
        console.error('Error creating medical record:', error);
        showStatus('Failed to create medical record: ' + error.message, 'error');
    } finally {
        setButtonLoading('createRecord', false);
    }
}

// Request access
async function requestAccess() {
    try {
        const patientId = document.getElementById('accessPatientId').value;
        const requestType = document.getElementById('requestType').value;

        if (!patientId || patientId < 1) {
            showStatus('Please enter a valid patient ID', 'error');
            return;
        }

        showStatus('Requesting access...', 'info');
        setButtonLoading('requestAccess', true);

        const tx = await contract.requestRecordAccess(
            parseInt(patientId),
            parseInt(requestType)
        );
        await tx.wait();

        showStatus('Access request submitted successfully!', 'success');

        // Clear form
        document.getElementById('accessPatientId').value = '';

    } catch (error) {
        console.error('Error requesting access:', error);
        showStatus('Failed to request access: ' + error.message, 'error');
    } finally {
        setButtonLoading('requestAccess', false);
    }
}

// Emergency access
async function emergencyAccess() {
    try {
        const patientId = document.getElementById('emergencyPatientId').value;
        const emergencyCode = document.getElementById('emergencyAccessCode').value;

        if (!patientId || patientId < 1) {
            showStatus('Please enter a valid patient ID', 'error');
            return;
        }

        if (!emergencyCode || emergencyCode < 0 || emergencyCode > 255) {
            showStatus('Please enter a valid emergency code (0-255)', 'error');
            return;
        }

        showStatus('Accessing emergency records...', 'info');
        setButtonLoading('emergencyAccess', true);

        const tx = await contract.emergencyAccess(
            parseInt(patientId),
            parseInt(emergencyCode)
        );
        await tx.wait();

        showStatus('Emergency access granted!', 'success');

        // Clear form
        document.getElementById('emergencyPatientId').value = '';
        document.getElementById('emergencyAccessCode').value = '';

    } catch (error) {
        console.error('Error accessing emergency records:', error);
        showStatus('Failed to access emergency records: ' + error.message, 'error');
    } finally {
        setButtonLoading('emergencyAccess', false);
    }
}

// Approve access
async function approveAccess() {
    try {
        const requestId = document.getElementById('approveRequestId').value;

        if (!requestId || requestId < 1) {
            showStatus('Please enter a valid request ID', 'error');
            return;
        }

        showStatus('Approving access...', 'info');
        setButtonLoading('approveAccess', true);

        const tx = await contract.approveAccess(parseInt(requestId));
        await tx.wait();

        showStatus('Access approved successfully!', 'success');

        // Clear form
        document.getElementById('approveRequestId').value = '';

    } catch (error) {
        console.error('Error approving access:', error);
        showStatus('Failed to approve access: ' + error.message, 'error');
    } finally {
        setButtonLoading('approveAccess', false);
    }
}

// Get system statistics
async function getSystemStats() {
    try {
        showStatus('Loading system statistics...', 'info');

        if (!contract) {
            showStatus('Contract not initialized. Please connect wallet first.', 'error');
            return;
        }

        const stats = await contract.getSystemStats();

        document.getElementById('totalRecords').textContent = stats.totalRecords.toString();
        document.getElementById('totalPatients').textContent = stats.totalPatients.toString();
        document.getElementById('totalRequests').textContent = stats.totalRequests.toString();

        showStatus('Statistics updated successfully!', 'success');

    } catch (error) {
        console.error('Error getting system stats:', error);

        // Set default values
        document.getElementById('totalRecords').textContent = 'N/A';
        document.getElementById('totalPatients').textContent = 'N/A';
        document.getElementById('totalRequests').textContent = 'N/A';

        if (error.code === 'CALL_EXCEPTION') {
            showStatus('Contract not found on this network. Please check the contract address and network.', 'error');
        } else {
            showStatus('Failed to load statistics: ' + error.message, 'error');
        }
    }
}

// View patient records
async function viewRecords() {
    try {
        let patientAddress = document.getElementById('viewPatientAddress').value;

        // If no address provided, use current account
        if (!patientAddress) {
            patientAddress = currentAccount;
        }

        if (!ethers.utils.isAddress(patientAddress)) {
            showStatus('Please enter a valid patient address', 'error');
            return;
        }

        showStatus('Loading patient records...', 'info');
        setButtonLoading('viewRecords', true);

        // Get record IDs for the patient
        const recordIds = await contract.getPatientRecordIds(patientAddress);

        if (recordIds.length === 0) {
            document.getElementById('recordsList').innerHTML = '<p>No records found for this patient.</p>';
            document.getElementById('recordsList').classList.remove('hidden');
            showStatus('No records found', 'info');
            return;
        }

        // Get record information for each ID
        let recordsHTML = '';
        for (let i = 0; i < recordIds.length; i++) {
            try {
                const recordInfo = await contract.getRecordInfo(recordIds[i]);
                const recordDate = new Date(recordInfo.timestamp * 1000);

                recordsHTML += `
                    <div class="record-item">
                        <h5>Record ID: ${recordIds[i]}</h5>
                        <p><strong>Status:</strong> ${recordInfo.isActive ? 'Active' : 'Inactive'}</p>
                        <p><strong>Created:</strong> ${recordDate.toLocaleString()}</p>
                        <p><strong>Authorized Doctor:</strong> ${recordInfo.authorizedDoctor}</p>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading record ${recordIds[i]}:`, error);
                recordsHTML += `
                    <div class="record-item">
                        <h5>Record ID: ${recordIds[i]}</h5>
                        <p><strong>Status:</strong> Access denied or record not found</p>
                    </div>
                `;
            }
        }

        document.getElementById('recordsList').innerHTML = recordsHTML;
        document.getElementById('recordsList').classList.remove('hidden');

        showStatus(`Found ${recordIds.length} record(s)`, 'success');

    } catch (error) {
        console.error('Error viewing records:', error);
        showStatus('Failed to load records: ' + error.message, 'error');

        document.getElementById('recordsList').innerHTML = '<p>Failed to load records. You may not have permission to view these records.</p>';
        document.getElementById('recordsList').classList.remove('hidden');
    } finally {
        setButtonLoading('viewRecords', false);
    }
}

// Utility functions
function showStatus(message, type) {
    const statusDiv = document.getElementById('connectionStatus');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}

function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (isLoading) {
        if (!button.getAttribute('data-original-text')) {
            button.setAttribute('data-original-text', button.textContent);
        }
        button.innerHTML = '<span class="loading"></span>Processing...';
        button.disabled = true;
    } else {
        const originalText = button.getAttribute('data-original-text') || button.textContent.replace('Processing...', '').replace(/loading/, '').trim();
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Initialize the DApp when the page loads
document.addEventListener('DOMContentLoaded', init);