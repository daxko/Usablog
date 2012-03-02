using System.Web.Mvc;
using Raven.Client.Linq;
using Web.Models;

namespace Web.Controllers
{
	public class FindingsController : AuthorizedControllerWithSession
    {
        //
        // GET: /Findings/

        public ActionResult Index(string studyId)
        {
        	var findings = DocumentSession.Query<Finding>()
        		.Where(f => f.StudyId == studyId);

            return new EntityJsonActionResult(findings);
        }

		public ActionResult Create(string studyId, string name)
		{
			var finding = new Finding(studyId, name);

			DocumentSession.Store(finding);
			DocumentSession.SaveChanges();

			return new EntityJsonActionResult(finding);
		}

		public ActionResult Details(string id)
		{
			var entryIds = DocumentSession.Load<Finding>(id).LogEntryIds;

			var entries = DocumentSession.Load<LogEntry>(entryIds);

			return new EntityJsonActionResult(entries);
		}

		public ActionResult AddEntry(string id, string logEntryId)
		{
			var finding = DocumentSession.Load<Finding>(id);
			finding.AddLogEntry(logEntryId);

			DocumentSession.SaveChanges();

			return new EntityJsonActionResult(finding);
		}

    }
}
