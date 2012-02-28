using System;
using System.Text;

namespace Web.Models
{
	public class Session
	{
		private Session() {}

		public Session(string studyId)
		{
			StudyId = studyId;
		}

		public string Id { get; private set; }
		public string StudyId { get; private set; }

		public DateTime? ScheduledStart { get; set; }

		public string Notes { get; set; }

		public string Facilitator { get; set; }
		public string RespondantName { get; set; }
		public string RespondantOrganization { get; set; }
		public string RespondantUrl { get; set; }

		public string VideoUrl { get; set; }

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

		public string DisplayName()
		{
			var sb = new StringBuilder();

			sb.Append(RespondantName);

			DateTime? sessionDate = StartedAt ?? ScheduledStart;
			if (sessionDate.HasValue)
			{
				sb.AppendFormat(" ({0})", sessionDate.Value.ToShortDateString());
			}

			return sb.ToString();
		}
	}

	

	public enum SessionStatus
	{
		NotStarted,
		InProgress,
		Ended
	}
}