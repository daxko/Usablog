using System.Collections.Generic;

namespace Web.Models
{
	public class Finding
	{
		private Finding() { }

		public Finding(string studyId, string name)
		{
			StudyId = studyId;
			Name = name;
			LogEntryIds = new List<string>();
		}

		public string Id { get; private set; }
		public string Name { get; set; }
		public string StudyId { get; private set; }
		public List<string> LogEntryIds { get; private set; }

		public void AddLogEntry(string logEntryId)
		{
			LogEntryIds.Add(logEntryId);
		}
	}
}