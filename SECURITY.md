# Security Guidelines

## API Key Management

This project uses sensitive API keys that must never be committed to version control.

### ✅ Safe Practices

1. **Use environment variables** for all API keys
2. **Use .env.local** for local development (ignored by git)
3. **Use Supabase Edge Function secrets** for server-side keys
4. **Use placeholder values** in demo code and documentation

### ❌ Never Do This

- Never commit real API keys to git
- Never hardcode API keys in source code
- Never put real keys in example files

### 🔐 SendGrid API Key Storage

- **Local Development**: Store in `.env.local` (ignored by git)
- **Production**: Store as Supabase Edge Function secret
- **Demo Code**: Use placeholder values like `your_api_key_here...`

### 🚨 If You Accidentally Commit a Secret

1. **Revoke the key immediately** in the service provider
2. **Generate a new key**
3. **Use git history rewriting** to remove the key from history
4. **Update all environments** with the new key

### 📝 Example Files

- `sendgrid.env.example` - Contains placeholder values only
- All demo components - Use masked/placeholder keys for display
- Documentation - Reference placeholder values

### 🔍 GitHub Push Protection

This repository has GitHub's secret scanning enabled, which will block pushes containing real API keys. If you encounter this:

1. Replace real keys with placeholders
2. Add the files to your commit
3. Push again

For more information, see: https://docs.github.com/en/code-security/secret-scanning 