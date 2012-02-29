namespace Web.Models
{
	public class LogEntry
	{
		private LogEntry() {}
		public LogEntry(string sessionId, string userId, int elapsed, string tag, string content)
		{
			SessionId = sessionId;
			LoggedByUserId = userId;
			ElapsedMillisecondsSinceSessionStart = elapsed;
			Tag = tag;
			Content = content;
		}

		public string Id { get; private set; }
		public string SessionId { get; private set; }

		public string LoggedByUserId { get; set; }

		public string Tag { get; set; }
		public int ElapsedMillisecondsSinceSessionStart { get; private set; }
		public string Content { get; set; }
	}
}