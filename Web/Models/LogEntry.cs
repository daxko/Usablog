namespace Web.Models
{
	public class LogEntry
	{
		public string Id { get; private set; }
		public string SessionId { get; private set; }

		public string LoggedByUserId { get; set; }

		public string Tag { get; set; }
		public int ElapsedMillisecondsSinceSessionStart { get; private set; }
		public string Content { get; set; }
	}
}