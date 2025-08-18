import request from 'supertest'; 
import app from '../../api/app'; 

describe('Auth router: /api/auth', () => {
  describe('POST /api/auth/register', () => {
    it('should respond with a 201 status code for a successful registration', async () => {
      const uniqueEmail = `testuser_${Date.now()}@example.com`;
      
      const response = await request(app)
        .post('/api/auth/register') 
        .send({
          displayName: "johndoe",
          email: uniqueEmail,
          password: "password123"
        });
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully.");
    });
  });

  describe('POST /api/auth/login', () => {
    it('should respond with a 401 status code for an invalid login', async () => {
      const response = await request(app)
        .post('/api/auth/login') 
        .send({
          email: "nonexistent@example.com",
          password: "wrongpassword"
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid email or password.");
    });
  });
});

describe('Protected Routes', () => {

  let authToken: string; 
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  const password = 'password123';

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        displayName: 'Test User',
        email: uniqueEmail,
        password: password
      });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: password
      });

    authToken = loginResponse.body.session.access_token;
  });

  describe('GET /api/auth/me', () => {
    it('should respond with user data for an authenticated request', async () => {
      const response = await request(app)
        .get('/api/auth/me') // The protected endpoint
        .set('Authorization', `Bearer ${authToken}`);

      
      expect(response.status).toBe(200);
      expect(response.body.email).toBe(uniqueEmail);
    });

    it('should respond with a 401 Unauthorized error for a request without a token', async () => {
      const response = await request(app).get('/api/auth/me'); // No token sent

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized: No token provided");
    });
  });
});
