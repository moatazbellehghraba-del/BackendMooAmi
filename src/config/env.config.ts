import { registerAs } from '@nestjs/config';

export default registerAs('env', () => ({
  port:parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10) ,
  },
  brevoApiKey: process.env.BREVO_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  verificationCodeExpMin: parseInt(process.env.VERIFICATION_CODE_EXP_MIN || '10', 10),
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
}));
