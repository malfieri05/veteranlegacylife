# Google Apps Script Fixes for Multiple Beneficiaries

## 1. ADD THIS HELPER FUNCTION TO YOUR MAIN.GS

Add this function right after the `findRowBySessionId` function:

```javascript
// Helper function to process beneficiary data - concatenate multiple beneficiaries
function processBeneficiaryData(data, sessionId) {
  let beneficiaryName = data.applicationData?.beneficiaryName || '';
  let beneficiaryRelationship = data.applicationData?.beneficiaryRelationship || '';
  
  // If we have a beneficiaries array, concatenate all beneficiaries
  if (data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
    const names = data.applicationData.beneficiaries
      .filter(b => b.name && b.name.trim() !== '')
      .map(b => b.name.trim());
    
    const relationships = data.applicationData.beneficiaries
      .filter(b => b.relationship && b.relationship.trim() !== '')
      .map(b => b.relationship.trim());
    
    // Use concatenated values if we have them, otherwise fall back to direct fields
    if (names.length > 0) {
      beneficiaryName = names.join(', ');
    }
    if (relationships.length > 0) {
      beneficiaryRelationship = relationships.join(', ');
    }
  }
  
  Logger.log(`[${sessionId}] Beneficiary processing - Names: "${beneficiaryName}", Relationships: "${beneficiaryRelationship}"`);
  
  return { beneficiaryName, beneficiaryRelationship };
}
```

## 2. REPLACE BENEFICIARY HANDLING IN ALL 4 FUNCTIONS

### Function 1: handleApplicationSubmission
Find this code (around line 191-204):
```javascript
// Handle beneficiary data consistently - check both direct fields and beneficiaries array
let beneficiaryName = data.applicationData?.beneficiaryName || '';
let beneficiaryRelationship = data.applicationData?.beneficiaryRelationship || '';

// If direct fields are empty, try to get from beneficiaries array
if (!beneficiaryName && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
  beneficiaryName = data.applicationData.beneficiaries[0].name || '';
}
if (!beneficiaryRelationship && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
  beneficiaryRelationship = data.applicationData.beneficiaries[0].relationship || '';
}

rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = beneficiaryName;
rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = beneficiaryRelationship;
```

Replace with:
```javascript
// Process beneficiary data using helper function
const { beneficiaryName, beneficiaryRelationship } = processBeneficiaryData(data, sessionId);

rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = beneficiaryName;
rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = beneficiaryRelationship;
```

### Function 2: handlePartialSubmission
Find this code (around line 365-378):
```javascript
// Handle beneficiary data consistently - check both direct fields and beneficiaries array
let beneficiaryName = data.applicationData?.beneficiaryName || '';
let beneficiaryRelationship = data.applicationData?.beneficiaryRelationship || '';

// If direct fields are empty, try to get from beneficiaries array
if (!beneficiaryName && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
  beneficiaryName = data.applicationData.beneficiaries[0].name || '';
}
if (!beneficiaryRelationship && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
  beneficiaryRelationship = data.applicationData.beneficiaries[0].relationship || '';
}

rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = beneficiaryName;
rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = beneficiaryRelationship;
```

Replace with:
```javascript
// Process beneficiary data using helper function
const { beneficiaryName, beneficiaryRelationship } = processBeneficiaryData(data, sessionId);

rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = beneficiaryName;
rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = beneficiaryRelationship;
```

### Function 3: handleLeadSubmission
Find this code (around line 474-487):
```javascript
// Handle beneficiary data consistently - check both direct fields and beneficiaries array
let beneficiaryName = data.applicationData?.beneficiaryName || '';
let beneficiaryRelationship = data.applicationData?.beneficiaryRelationship || '';

// If direct fields are empty, try to get from beneficiaries array
if (!beneficiaryName && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
  beneficiaryName = data.applicationData.beneficiaries[0].name || '';
}
if (!beneficiaryRelationship && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
  beneficiaryRelationship = data.applicationData.beneficiaries[0].relationship || '';
}

rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = beneficiaryName;
rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = beneficiaryRelationship;
```

Replace with:
```javascript
// Process beneficiary data using helper function
const { beneficiaryName, beneficiaryRelationship } = processBeneficiaryData(data, sessionId);

rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = beneficiaryName;
rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = beneficiaryRelationship;
```

### Function 4: handleLeadPartialSubmission
Find this code (around line 585-598):
```javascript
// Handle beneficiary data consistently - check both direct fields and beneficiaries array
let beneficiaryName = data.applicationData?.beneficiaryName || '';
let beneficiaryRelationship = data.applicationData?.beneficiaryRelationship || '';

// If direct fields are empty, try to get from beneficiaries array
if (!beneficiaryName && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
  beneficiaryName = data.applicationData.beneficiaries[0].name || '';
}
if (!beneficiaryRelationship && data.applicationData?.beneficiaries && data.applicationData.beneficiaries.length > 0) {
  beneficiaryRelationship = data.applicationData.beneficiaries[0].relationship || '';
}

rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = beneficiaryName;
rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = beneficiaryRelationship;
```

Replace with:
```javascript
// Process beneficiary data using helper function
const { beneficiaryName, beneficiaryRelationship } = processBeneficiaryData(data, sessionId);

rowData[SHEET_COLUMNS.BENEFICIARY_NAME - 1] = beneficiaryName;
rowData[SHEET_COLUMNS.BENEFICIARY_RELATIONSHIP - 1] = beneficiaryRelationship;
```

## 3. UPDATED TEST DATA (Already Done)

The test data in `testNewEntriesAndEmails` function has been updated to include multiple beneficiaries:

```javascript
beneficiaries: [
  { name: 'Jane Doe', relationship: 'Spouse', percentage: 60 },
  { name: 'Bob Smith', relationship: 'Child', percentage: 40 }
]
```

## 4. WHAT THIS FIXES

✅ **Multiple Beneficiaries**: "Jane Doe, Bob Smith, Mary Johnson"  
✅ **Multiple Relationships**: "Spouse, Child, Sister"  
✅ **Single Beneficiary**: Works normally  
✅ **Empty Data**: Handled gracefully  
✅ **Email Templates**: Display all beneficiaries clearly  
✅ **Google Sheet**: Stores concatenated data in 2 columns  

## 5. TESTING

After making these changes:
1. Deploy your Google Apps Script
2. Run `testNewEntriesAndEmails` function
3. Check Google Sheet columns 27-28 for concatenated beneficiary data
4. Check email for proper beneficiary display

## 6. EXPECTED RESULTS

**Google Sheet:**
- Column 27: "Jane Doe, Bob Smith"
- Column 28: "Spouse, Child"

**Email:**
- Shows all beneficiaries clearly separated
- Maintains clean formatting
