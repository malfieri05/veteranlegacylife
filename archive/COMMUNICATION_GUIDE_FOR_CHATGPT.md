# Communication Guide for ChatGPT - Veteran Life Insurance Project

## 🎯 **How to Help the User Communicate with Claude**

### **Before Suggesting New Features:**

1. **Ask for Specific Requirements**
   - "What exactly do you want this feature to do?"
   - "Who will use this feature?"
   - "What's the user experience you want?"

2. **Check Impact on Existing Features**
   - "Will this affect the email system?"
   - "Does this change how data is captured?"
   - "Will this break any existing forms?"

3. **Consider Technical Constraints**
   - "This is a static HTML site - no server-side processing"
   - "Google Apps Script handles backend"
   - "Data flows: Forms → JavaScript → Google Apps Script → Email/Sheets"

### **When Planning New Features:**

1. **Break Down the Request**
   - Split complex features into smaller parts
   - Suggest testing each part separately
   - Identify dependencies

2. **Suggest Testing Strategy**
   - "Test this with the existing test page first"
   - "Use the development workflow document"
   - "Create a feature branch for this"

3. **Consider Safety Measures**
   - "Should we backup current state first?"
   - "How can we test this without breaking existing features?"
   - "What's the rollback plan if something goes wrong?"

### **Communication Templates for the User:**

#### **For Simple Features:**
```
"I want to add [specific feature] to [specific page/form]. 
The feature should [specific behavior]. 
Users should be able to [specific action]."
```

#### **For Complex Features:**
```
"I want to add [feature name] that will:
1. [specific requirement 1]
2. [specific requirement 2] 
3. [specific requirement 3]

This should work with the existing [form/email/sheet] system.
Can we test this incrementally?"
```

#### **For Bug Fixes:**
```
"On [specific page], when users [specific action], 
[describe the problem]. 
The expected behavior should be [describe correct behavior]."
```

### **Questions to Ask the User:**

#### **Clarification Questions:**
- "Which specific page/form should this be added to?"
- "Should this data be included in the email notifications?"
- "Does this need to be stored in Google Sheets?"
- "Should this work with existing form validation?"

#### **Technical Questions:**
- "Should this be a new page or added to existing pages?"
- "Does this require changes to the Google Apps Script?"
- "Should this have its own test form?"
- "What happens if this feature fails?"

#### **Testing Questions:**
- "How should we test this feature?"
- "What's the success criteria?"
- "Should we test this with the existing test page?"
- "What's the rollback plan?"

### **Red Flags to Watch For:**

1. **Vague Requests**
   - ❌ "Make it better"
   - ✅ "Add a dropdown for state selection"

2. **Multiple Changes at Once**
   - ❌ "Add email validation, change the design, and add new forms"
   - ✅ "Let's add email validation first, test it, then move to design"

3. **Ignoring Existing Systems**
   - ❌ "Add a new database"
   - ✅ "How can we use the existing Google Sheets system?"

### **Suggested Process for New Features:**

1. **Define the Feature Clearly**
   - What exactly should it do?
   - Which pages/forms are involved?
   - What data should be captured?

2. **Check Existing Systems**
   - Will this affect email delivery?
   - Does this change Google Sheets structure?
   - Are there existing similar features?

3. **Plan Testing**
   - How to test without breaking existing features?
   - What's the test data?
   - How to verify it works?

4. **Plan Implementation**
   - Which files need changes?
   - Should we use feature flags?
   - What's the deployment plan?

### **Example Good Request:**
```
"I want to add a 'Preferred Contact Time' dropdown to the main funnel form. 
Users should be able to select from: Morning, Afternoon, Evening, Any Time.
This data should be included in the email notifications and Google Sheets.
Can we add this to the existing contact info section?"
```

### **Example Bad Request:**
```
"Make the forms better and add more features"
```

---

**Remember: The goal is to help the user communicate clearly so Claude can implement features safely without breaking the existing working system.** 