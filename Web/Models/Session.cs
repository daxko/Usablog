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

		public DateTime? StartDate { get { return StartedAt ?? ScheduledStart; } }

		public string Notes { get; set; }

		public string Facilitator { get; set; }
		public string RespondentName { get; set; }
		public string RespondentOrganization { get; set; }
		public string RespondentUrl { get; set; }

		public string VideoUrl { get; set; }

		public DateTime? StartedAt { get; set; }
		public DateTime? EndedAt { get; set; }

		public SessionStatus Status
		{
			get
			{
				if (EndedAt == null)
				{
					if (StartedAt == null)
						return SessionStatus.NotStarted;
					return SessionStatus.InProgress;
				}
				return SessionStatus.Ended;
			}
		}

		public string DisplayName()
		{
			var sb = new StringBuilder();

			if (!string.IsNullOrWhiteSpace(RespondentName))
			{
				sb.Append(RespondentName);
			}
			else
			{
				sb.Append("Unnamed");
			}

			if (!string.IsNullOrWhiteSpace(RespondentOrganization))
			{
				sb.AppendFormat(" @ {0}", RespondentOrganization);
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