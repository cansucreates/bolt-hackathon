# 🔧 Authentication Troubleshooting Guide

## Problem: Sign-in shows "LOADING" but fails to complete

### 1. Authentication Flow Analysis

The authentication process follows this sequence:
```
User Input → AuthModal → AuthContext → Supabase → Database → UI Update
```

**Potential failure points:**
- Environment variables missing/incorrect
- Supabase client configuration issues
- Network connectivity problems
- Database trigger failures
- State management race conditions

### 2. Common Causes & Solutions

#### A. Environment Variables Issues
**Check these variables in your deployment:**
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Verification steps:**
1. Check Netlify environment variables
2. Ensure no trailing spaces or quotes
3. Verify URL format: `https://your-project.supabase.co`

#### B. Network/CORS Issues
**Symptoms:** Requests fail silently or with CORS errors

**Solutions:**
1. Check Supabase project settings → Authentication → Site URL
2. Add your Netlify domain to allowed origins
3. Verify redirect URLs include your domain

#### C. Database Trigger Failures
**Symptoms:** User authenticates but profile creation fails

**Check:** Supabase Dashboard → Database → Functions
- Ensure `handle_new_user()` function exists
- Check trigger `on_auth_user_created` is active

### 3. Debugging Steps

#### Step 1: Check Browser Console
Look for these error patterns:
```javascript
// Network errors
"Failed to fetch"
"CORS policy"
"ERR_NETWORK"

// Supabase errors
"Invalid API key"
"Project not found"
"Row Level Security policy violation"

// Auth errors
"Invalid login credentials"
"Email not confirmed"
"Too many requests"
```

#### Step 2: Network Tab Analysis
Monitor these requests:
1. `POST /auth/v1/token` - Initial sign-in
2. `GET /auth/v1/user` - User data fetch
3. `POST /rest/v1/users` - Profile creation

#### Step 3: Check Auth State
Add this to your component for debugging:
```javascript
useEffect(() => {
  console.log('Auth Debug:', { user, loading, session });
}, [user, loading, session]);
```

### 4. Browser Compatibility

**Known issues:**
- Safari: Third-party cookies disabled
- Firefox: Enhanced tracking protection
- Chrome: SameSite cookie policies

**Solutions:**
- Test in incognito mode
- Disable browser extensions
- Check cookie settings

### 5. Timeout Handling

The current implementation may hang indefinitely. Recommended timeout:
```javascript
const SIGN_IN_TIMEOUT = 30000; // 30 seconds
```

### 6. State Management Issues

**Race conditions can occur when:**
- Multiple auth state changes happen rapidly
- Component unmounts during auth process
- Network requests overlap

### 7. Quick Diagnostic Checklist

- [ ] Environment variables set correctly
- [ ] Supabase project URL accessible
- [ ] Database triggers functioning
- [ ] CORS settings configured
- [ ] Browser console shows no errors
- [ ] Network requests completing successfully
- [ ] Auth state updating properly

### 8. Emergency Fixes

If authentication is completely broken:

1. **Reset Supabase client:**
   ```javascript
   // Clear all auth state
   await supabase.auth.signOut();
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Check service status:**
   - Supabase status page
   - Netlify status page
   - Your domain DNS resolution

3. **Fallback authentication:**
   - Test with email/password only
   - Disable Google OAuth temporarily
   - Use Supabase dashboard to create test user

### 9. Production vs Development Differences

**Common deployment issues:**
- Environment variables not set in Netlify
- Different redirect URLs needed
- HTTPS vs HTTP protocol mismatches
- CDN caching auth responses

### 10. Contact Points for Support

If issues persist:
1. Check Supabase community forum
2. Review Netlify deployment logs
3. Test authentication in Supabase dashboard directly
</parameter>