using System;

namespace Web.Models
{
	public class Session
	{
		private Session() {}

		public Session(string studyId, string name)
		{
			StudyId = studyId;
			Name = name;
		}

		public string Id { get; private set; }
		public string StudyId { get; private set; }
		public string Name { get; set; }

		public string Notes { get; set; }

		public string Facilitator { get; set; }
		public string RespondantName { get; set; }

		public DateTime? StartedAt { get; set; }
		public DateTime? EndedAt { get; set; }

		public SessionStatus Status
		{
			get
			{
				if (StartedAt == null)
				{
					if(EndedAt == null)
						return SessionStatus.NotStarted;
					return SessionStatus.Ended;
				}
				return SessionStatus.InProgress;
			}
		}
	}

	public enum SessionStatus
	{
		NotStarted,
		InProgress,
		Ended
	}
}