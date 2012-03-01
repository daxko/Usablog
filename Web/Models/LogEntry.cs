using System.Collections.Generic;
using System.Linq;

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

		public static TagInfo[] Tags =
			{
				new TagInfo("f", "Facilitator", "Spoken by the facilitator"),
				new TagInfo("r", "Respondent", "Spoken by the respondent"),
				new TagInfo("s", "Scenario", "Scenario was begun"),
				new TagInfo("q", "Quote", "Direct quote, usually by the respondent"),
				new TagInfo("e", "User Error", "The respondent made an error"),
				new TagInfo("a", "Assistance", "The facilitator gave assistance"),
				new TagInfo("b", "Bug", "Note of a bug"),
			};

		public static IDictionary<string, TagInfo> TagsConfig
		{
			get
			{
				return Tags.ToDictionary(tagInfo => tagInfo.Tag);
			}
		}
	}

	public struct TagInfo
	{
		public TagInfo(string tag, string name, string help)
		{
			Tag = tag;
			Name = name;
			Help = help;
		}

		public string Tag;
		public string Name;
		public string Help;
	}
}