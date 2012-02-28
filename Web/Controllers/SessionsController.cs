using System;
using System.Web.Mvc;
using Web.Models;

namespace Web.Controllers
{
	public class SessionsController : AuthorizedControllerWithSession
	{
		//
		// GET: /Sessions/Details/5

		public ActionResult Details(string id)
		{
			var session = DocumentSession.Include<Session>(s => s.StudyId).Load(id);
			ViewBag.Study = DocumentSession.Load<Study>(session.StudyId);
			return View(session);
		}

		//
		// GET: /Sessions/Create

		public ActionResult Create(string studyId)
		{
			ViewBag.Study = DocumentSession.Load<Study>(studyId);
			var session = new Session(studyId);
			return View(session);
		} 

		//
		// POST: /Sessions/Create

		[HttpPost]
		public ActionResult Create(SessionInputs inputs)
		{
			var session = new Session(inputs.StudyId)
			{
				ScheduledStart = inputs.ScheduledStart,
				Facilitator = inputs.Facilitator,
				RespondantName = inputs.RespondantName,
				RespondantOrganization = inputs.RespondantOrganization,
				RespondantUrl = inputs.RespondantUrl,
				VideoUrl = inputs.VideoUrl,
				Notes = inputs.Notes
			};

			try
			{
				DocumentSession.Store(session);
				DocumentSession.SaveChanges();

				return RedirectToAction("Details", "Studies", new { Id = inputs.StudyId });
			}
			catch
			{
				ViewBag.Study = DocumentSession.Load<Study>(inputs.StudyId);
				return View(session);
			}
		}

		//
		// GET: /Sessions/Edit/5

		public ActionResult Edit(string id)
		{
			var session = DocumentSession.Include<Session>(s => s.StudyId).Load(id);
			ViewBag.Study = DocumentSession.Load<Study>(session.StudyId);
			return View(session);
		}

		//
		// POST: /Sessions/Edit/5

		[HttpPost]
		public ActionResult Edit(string id, SessionInputs inputs)
		{
			var session = DocumentSession.Include<Session>(s => s.StudyId).Load(id);

			session.ScheduledStart = inputs.ScheduledStart;
			session.Facilitator = inputs.Facilitator;
			session.RespondantName = inputs.RespondantName;
			session.RespondantOrganization = inputs.RespondantOrganization;
			session.RespondantUrl = inputs.RespondantUrl;
			session.VideoUrl = inputs.VideoUrl;
			session.Notes = inputs.Notes;			

			try
			{
				DocumentSession.SaveChanges();

				return RedirectToAction("Details", new { Id = id });
			}
			catch
			{
				ViewBag.Study = DocumentSession.Load<Study>(session.StudyId);
				return View(session);
			}
		}

		public class SessionInputs
		{
			public string StudyId { get; set; }
			public DateTime? ScheduledStart { get; set; }
			public string Facilitator { get; set; }
			public string RespondantName { get; set; }
			public string RespondantOrganization { get; set; }
			public string RespondantUrl { get; set; }
			public string VideoUrl { get; set; }
			public string Notes { get; set; }
		}
	}
}
