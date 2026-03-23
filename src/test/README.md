# Sandbox Testing Suite

This folder contains testing utilities for the ProjectWorkspace component and sandbox rendering functionality.

## Quick Start

### Option 1: Test Mode URL (Easiest)
Simply append `?test=sandbox` to your app URL:
```
http://localhost:5173/?test=sandbox
```

This will skip the form and take you directly to the sandbox tester where you can test different project types.

### Option 2: Import SandboxTester Directly
```tsx
import SandboxTester from './test/SandboxTester';

// In your component:
<SandboxTester />
```

## What's Included

### `fixtures/mockProjects.ts`
Contains three different mock projects you can test:

1. **mockHtmlProject** - Vanilla HTML + CSS + JavaScript
   - Tests iframe rendering with `srcDoc`
   - Good for basic HTML/CSS validation

2. **mockReactProject** - React with Tailwind CSS
   - Full React component with state
   - Tests CodeSandbox API integration
   - Includes interactive button counter

3. **mockNextProject** - Next.js framework
   - Tests framework project detection
   - Verifies package.json structure

### `SandboxTester.tsx`
A complete testing interface that allows you to:
- Select different project types
- View project details and file list
- Launch the ProjectWorkspace with mock data
- No API calls needed - all data is local

## Testing Workflow

1. **Start the app in test mode:**
   ```bash
   npm run dev
   # Then visit: http://localhost:5173/?test=sandbox
   ```

2. **Select a project type** (HTML, React, or Next.js)

3. **Click "View ProjectWorkspace"**

4. **Test the Code view:**
   - Browse through generated files
   - Check syntax highlighting
   - Copy code to clipboard

5. **Test the Live view:**
   - For HTML: Check if iframe renders with `srcDoc`
   - For React/Framework: 
     - Open DevTools (F12) → Console
     - Look for debug logs (🚀, 📁, ✅, ❌ emojis)
     - Check if CodeSandbox iframe loads or fallback button appears
     - Click button to open in CodeSandbox

## Debug Logging

The sandbox component logs detailed information to help debug issues:

```
🔄 Live view mode activated
📊 useEffect triggered - viewMode: live projectType: react
🔍 sandboxRef.current exists? true
⚙️ initializeCodeSandbox called
🚀 Initializing sandbox for: react
📁 Files: [...list of files]
📍 CodeSandbox URL length: 12543
✅ Iframe created and appended
```

**Common issues:**
- `sandboxRef.current exists? false` - DOM not ready or ref not attached
- `Error: No files generated` - Check mockProjects fixture
- Empty iframe - Check CodeSandbox URL length (has limits)

## Adding New Test Projects

Edit `fixtures/mockProjects.ts` and add a new project:

```tsx
export const mockMyProject: GenerationResult = {
  files: [
    {
      path: 'index.html',
      content: '...',
    },
    // ... more files
  ],
};
```

Then update `SandboxTester.tsx` to include it in the selection UI.

## Performance Tips

- HTML projects render instantly (no API calls)
- React/Framework projects may take 5-10 seconds to load in CodeSandbox
- No rate limiting - test as much as you want locally
- Refresh the page to reset state

## Browser DevTools Tips

**Console Tab:**
- Filter by "App" to see our debug logs
- Look for 🚀, ✅, ❌ emojis for easy scanning

**Network Tab:**
- HTML projects: No external requests (except fonts/images in srcDoc)
- React projects: Will show CodeSandbox API call and iframe load
- No Gemini API calls in test mode

**Elements/Inspector:**
- Inspect the sandbox div to see iframe structure
- Check iframe src URL in dev tools

## Troubleshooting

**White screen in Live tab?**
1. Check console for error logs (F12)
2. Check if `sandboxRef.current` exists
3. For React: Check CodeSandbox URL isn't too long
4. Try HTML project first to verify setup

**Sandbox not loading?**
1. Make sure you're in "Live" view (not "Code")
2. Check browser console for errors
3. Try the fallback button to open in new window
4. Check network tab for CodeSandbox API response

**Files not showing in Code view?**
1. Check that fixture has proper file paths
2. Click on files in sidebar to select them
3. Verify file content isn't empty

## Next Steps

After testing locally:
1. Re-test with actual API-generated projects
2. Monitor console logs on production
3. Collect error reports for different browsers
4. Optimize CodeSandbox URL encoding if needed
