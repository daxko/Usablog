namespace Web.Models
{
	public class User
	{
		private User() { }

		public User(string email, string hashedPassword, byte[] passwordSalt)
		{
			Id = UserId(email);
			Email = email;
			HashedPassword = hashedPassword;
			PasswordSalt = passwordSalt;
		}

		public static string UserId(string email)
		{
			return "users/" + email;
		}

		public string Id { get; private set; }

		public string Email { get; private set; }

		public string HashedPassword { get; set; }

		public byte[] PasswordSalt { get; set; }
	}
}