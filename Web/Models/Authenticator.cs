using System;
using System.Security.Cryptography;

namespace Web.Models
{
	public class Authenticator
	{
		internal const int HashIterations = 5000;

		public User Create(string email, string password)
		{
			var salt = BuildRandomSalt();
			return new User(email, Hash(password, salt), salt);
		}

		public string Hash(string rawPassword, byte[] salt)
		{
			var hashed = DoHash(rawPassword, salt);
			return Convert.ToBase64String(hashed);
		}

		public bool PasswordsMatch(string rawPassword, string hashedPassword, byte[] salt)
		{
			var hashedBytes = Convert.FromBase64String(hashedPassword);
			var hashed = DoHash(rawPassword, salt);

			var match = true;
			for (var i = 0; i < 60; i++)
			{
				match = match && hashed[i] == hashedBytes[i];
			}
			return match;
		}

		private byte[] DoHash(string password, byte[] salt)
		{
			using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, HashIterations))
				return pbkdf2.GetBytes(60);
		}

		internal byte[] BuildRandomSalt()
		{
			//generates 64 byte hash
			var bytes = new byte[64];
			var rng = RNGCryptoServiceProvider.Create();
			rng.GetNonZeroBytes(bytes);

			return bytes;
		}
	}
}