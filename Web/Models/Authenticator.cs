using System;
using System.Security.Cryptography;

namespace Web.Models
{
	public class Authenticator
	{
		private readonly byte[] Salt = new byte[] {5, 5, 79, 6, 8, 10, 5, 2};
		internal const int HashIterations = 5000;

		public User Create(string email, string password)
		{
			return new User(email, Hash(password));
		}

		public string Hash(string rawPassword)
		{
			var hashed = DoHash(rawPassword);
			return Convert.ToBase64String(hashed);
		}

		public bool PasswordsMatch(string rawPassword, string hashedPassword)
		{
			var hashedBytes = Convert.FromBase64String(hashedPassword);
			var hashed = DoHash(rawPassword);

			var match = true;
			for (var i = 0; i < 60; i++)
			{
				match = match && hashed[i] == hashedBytes[i];
			}
			return match;
		}

		private byte[] DoHash(string password)
		{
			using (var pbkdf2 = new Rfc2898DeriveBytes(password, Salt, HashIterations))
				return pbkdf2.GetBytes(60);
		}
	}
}