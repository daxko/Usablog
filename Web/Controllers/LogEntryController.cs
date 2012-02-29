using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Elmah;
using Web.Models;

namespace Web.Controllers
{
	public class LogEntryController : AuthorizedControllerWithSession
	{
		//
		// GET: /LogEntry/

		public ActionResult Index(string sessionId)
		{
			var entries = DocumentSession.Query<LogEntry>()
				.Where(x => x.SessionId == sessionId)
				.OrderBy(x => x.ElapsedMillisecondsSinceSessionStart)
				.Take(1024)
				.ToList();

			return new EntityJsonActionResult(entries);
		}


		public ActionResult Create(string sessionId, string content, int elapsedMillisecondsSinceSessionStart = -1)
		{
			var logEntry = new LogEntry(sessionId, CurrentUserId, elapsedMillisecondsSinceSessionStart, null, content);
			try
			{
				DocumentSession.Store(logEntry);
				DocumentSession.SaveChanges();

				Response.StatusCode = 201;
				return new EntityJsonActionResult(logEntry);
			}
			catch(Exception ex)
			{
				ErrorSignal.FromCurrentContext().Raise(ex);
				return new HttpStatusCodeResult(500, "Unexpected error saving log entry. Failure has been logged.");
			}
		}
	}
}
