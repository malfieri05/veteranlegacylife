# Development Workflow - Prevent Breaking Changes

## 🛡️ **Before Making Any Changes**

### 1. Create a Feature Branch
```bash
git checkout -b feature/new-feature-name
```

### 2. Test Current Functionality
- [ ] Test form submission
- [ ] Verify email delivery
- [ ] Check Google Sheet data
- [ ] Test all existing forms

### 3. Document What's Working
- [ ] List all working features
- [ ] Note any current issues
- [ ] Document current behavior

## 🔧 **During Development**

### 1. Make Small, Focused Changes
- ✅ Change one thing at a time
- ❌ Don't modify multiple features simultaneously
- ✅ Test after each small change

### 2. Use Feature Flags
```javascript
// Example: Feature flag for new functionality
const NEW_FEATURE_ENABLED = false;

if (NEW_FEATURE_ENABLED) {
    // New code here
} else {
    // Existing working code
}
```

### 3. Add Console Logging
```javascript
console.log('🔍 DEBUG: Feature X is working');
console.log('📊 Data being sent:', data);
```

## 🧪 **Testing Checklist**

### Before Each Change:
- [ ] Form submission works
- [ ] Email is sent to michaelalfieri.ffl@gmail.com
- [ ] Google Sheet receives data
- [ ] All user selections are captured
- [ ] No JavaScript errors in console

### After Each Change:
- [ ] Same tests as above
- [ ] New feature works as expected
- [ ] No regression in existing features

## 📝 **Documentation**

### Keep Track Of:
1. **What's Working** - List of functional features
2. **What's Broken** - Issues that need fixing
3. **What's New** - Features being added
4. **Dependencies** - What relies on what

## 🔄 **Rollback Strategy**

### If Something Breaks:
1. **Don't panic** - We have Git
2. **Identify the issue** - Check console logs
3. **Revert if needed** - `git checkout .` or `git reset --hard HEAD`
4. **Fix incrementally** - Make smaller changes

## 📋 **Current Working Features**

### ✅ **Core Functionality**
- [x] Form data capture
- [x] Email delivery to michaelalfieri.ffl@gmail.com
- [x] Google Sheet integration
- [x] All user selections captured
- [x] Comprehensive email content

### 🔧 **Recent Optimizations**
- [x] Email sent immediately upon submission
- [x] Eye-catching email subject lines
- [x] Complete user data in emails
- [x] Error handling

## 🚨 **Emergency Rollback Commands**

```bash
# Revert all changes
git reset --hard HEAD

# Revert specific file
git checkout HEAD -- script.js

# Go back to last working commit
git log --oneline
git reset --hard <commit-hash>
```

## 📊 **Testing Protocol**

### Before Deploying:
1. **Local testing** - Test on localhost:8000
2. **Form submission** - Submit test data
3. **Email verification** - Check michaelalfieri.ffl@gmail.com
4. **Sheet verification** - Check Google Sheet
5. **Console check** - No JavaScript errors

### After Deploying:
1. **Live testing** - Test on actual site
2. **Real form submission** - Submit real data
3. **Email delivery** - Verify email arrives
4. **Data accuracy** - Check all fields captured

---

**Remember: Small, incremental changes are safer than big, sweeping changes!** 