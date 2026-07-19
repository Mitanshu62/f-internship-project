const requiredEnv = ['MONGODB_URI', 'SESSION_SECRET'];
const envErrors = [];

requiredEnv.forEach(envVar => {
  if (!process.env[envVar]) {
    envErrors.push(`Environment variable ${envVar} is missing.`);
  }
});

if (envErrors.length > 0) {
  console.error('\n==================================================');
  console.error('[ENV CONFIGURATION ERROR] Missing Required Environment Variables:');
  envErrors.forEach(err => console.error(`- ${err}`));
  console.error('==================================================\n');
}

module.exports = {
  isValid: envErrors.length === 0,
  errors: envErrors
};
