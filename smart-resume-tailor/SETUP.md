# Smart Resume Tailor - Setup & Deployment Guide

## 🚀 Quick Start

### 1. **Set Up OpenAI API Key**

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and add your OpenAI API key
OPENAI_API_KEY=sk-your-api-key-here
```

Get your API key: https://platform.openai.com/api-keys

### 2. **Install Dependencies**

```bash
npm install
```

All required dependencies are already in `package.json`:
- `next` - Framework
- `react` - UI library  
- `openai` - OpenAI API client
- `pdf-parse` - PDF extraction
- `tailwindcss` - Styling

### 3. **Run Development Server**

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
smart-resume-tailor/
├── app/
│   ├── page.tsx                    # Main UI page
│   ├── components/
│   │   └── Results.tsx             # Results display component
│   ├── api/
│   │   └── generate/
│   │       └── route.js            # API endpoint for AI generation
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── package.json                    # Dependencies
├── next.config.ts                  # Next.js config
├── tailwind.config.js              # Tailwind CSS config
└── .env.local                      # Environment variables (create this)
```

## 🔧 How It Works

### **Frontend (page.tsx)**
- File upload input for PDF resumes
- Textarea for job descriptions
- Sends both to API endpoint

### **API Route (app/api/generate/route.js)**
1. **Parse PDF** - Extracts text from uploaded PDF using `pdf-parse`
2. **Call OpenAI** - Sends resume + job description to GPT-4o-mini
3. **Enforce JSON** - Returns structured output with retry logic
4. **Schema Output**:
```json
{
  "cover_letter": "Generated cover letter text",
  "ats_resume_tweaks": [
    {
      "original_resume_bullet": "Original text",
      "suggested_revision": "Improved text",
      "reasoning": "Why this is better"
    }
  ],
  "missing_keywords": ["keyword1", "keyword2"]
}
```

### **Results Display (Results.tsx)**
- Tabbed interface for Cover Letter, Resume Tweaks, Keywords
- Copy-to-clipboard functionality
- Tips for implementation

## 🌐 Deployment to Vercel

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### **Step 2: Import into Vercel**
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel auto-detects Next.js configuration

### **Step 3: Add Environment Variables**
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your OpenAI API key
3. Click "Save"

### **Step 4: Deploy**
- Click "Deploy"
- Vercel builds and deploys automatically
- Your app will be live in ~2-3 minutes

**Live URL**: `https://your-project-name.vercel.app`

## 🛡️ Important Security Notes

- **Never commit `.env.local`** - It's in `.gitignore`
- **API keys stay on server** - Never exposed to frontend
- **PDF parsing** - Files never stored, processed in memory
- **Rate limiting** - Consider adding rate limits for production

## 📊 Cost Estimation

Using GPT-4o-mini:
- ~500 tokens per request (avg)
- ~$0.00015 USD per request
- 1000 requests/month ≈ $0.15

## 🐛 Troubleshooting

### "PDF parsing failed"
- Ensure PDF contains readable text
- Check PDF isn't scanned image
- Try re-exporting from Word/Google Docs

### "OpenAI API error"
- Verify API key in `.env.local`
- Check API key has credit/is active
- Ensure key has correct permissions

### "JSON parsing error"
- Automatic retry in API (3 attempts)
- If persists, check OpenAI API status
- May need to adjust temperature/tokens

### "Build fails on Vercel"
- Clear build cache in Vercel settings
- Ensure all env variables are set
- Check Node.js version compatibility

## 📈 Future Enhancements

- [ ] Multiple file support (upload multiple PDFs)
- [ ] Cover letter templates
- [ ] Resume section recommendations
- [ ] LinkedIn profile integration
- [ ] Export to Word/PDF formats
- [ ] User accounts & history
- [ ] Premium features (Claude, GPT-4)

## 📝 License

MIT - Feel free to use and modify

## 🤝 Support

For issues or questions:
- Check Vercel logs: `vercel logs`
- Check OpenAI API status
- Review browser console for client errors
