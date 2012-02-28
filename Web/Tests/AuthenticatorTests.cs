using NUnit.Framework;
using Web.Models;

namespace Web.Tests
{
	[TestFixture]
	public class AuthenticatorTests
	{
		private Authenticator _authenticator;

		[SetUp]
		public void SetUp()
		{
			_authenticator = new Authenticator();
		} 

		[Test]
		public void Matching()
		{
			var user = _authenticator.Create("a@a.@", "password");
			var isMatch = _authenticator.PasswordsMatch("password", user.HashedPassword, user.PasswordSalt);
			Assert.IsTrue(isMatch);
		}

		[Test]
		public void NotMatching()
		{
			var user = _authenticator.Create("a@a.@", "password");
			var isMatch = _authenticator.PasswordsMatch("password1", user.HashedPassword, user.PasswordSalt);
			Assert.IsFalse(isMatch);
		}

		[Test]
		public void SamePassword_DifferentHash()
		{
			var user1 = _authenticator.Create("a@a.@", "password");
			var user2 = _authenticator.Create("a@a.@", "password");

			Assert.AreNotEqual(user1.HashedPassword, user2.HashedPassword);
		}

		[Test]
		public void SamePassword_DifferentSalt()
		{
			var user1 = _authenticator.Create("a@a.@", "password");
			var user2 = _authenticator.Create("a@a.@", "password");

			Assert.AreNotEqual(user1.PasswordSalt, user2.PasswordSalt);
		}
	}
}