namespace Web.Models
{
	public class User
	{
		private User() { }

		public User(string email, string hashedPassword)
		{
			Id = UserId(email);
			Email = email;
			HashedPassword = hashedPassword;
		}

		public static string UserId(string email)
		{
			return "users/" + email;
		}

		public string Id { get; private set; }

		public string Email { get; private set; }

		public string HashedPassword { get; set; }
	}
}