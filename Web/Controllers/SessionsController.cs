using System;
using System.Web.Mvc;
using Web.Models;

namespace Web.Controllers
{
	[ServeJsonForAjax]
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
				RespondentName = inputs.RespondentName,
				RespondentOrganization = inputs.RespondentOrganization,
				RespondentUrl = inputs.RespondentUrl,
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
			session.RespondentName = inputs.RespondentName;
			session.RespondentOrganization = inputs.RespondentOrganization;
			session.RespondentUrl = inputs.RespondentUrl;
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

		[HttpPost]
		public ActionResult Start(string id)
		{
			var session = DocumentSession.Load<Session>(id);
			session.StartedAt = DateTime.Now;
			try
			{
				DocumentSession.SaveChanges();
				return new HttpStatusCodeResult(200);
			}
			catch
			{
				return new HttpStatusCodeResult(500);
			}
		}

		[HttpPost]
		public ActionResult Stop(string id)
		{
			var session = DocumentSession.Load<Session>(id);
			session.EndedAt = DateTime.Now;
			try
			{
				DocumentSession.SaveChanges();
				return new HttpStatusCodeResult(200);
			}
			catch
			{
				return new HttpStatusCodeResult(500);
			}
		}

		public class SessionInputs
		{
			public string StudyId { get; set; }
			public DateTime? ScheduledStart { get; set; }
			public string Facilitator { get; set; }
			public string RespondentName { get; set; }
			public string RespondentOrganization { get; set; }
			public string RespondentUrl { get; set; }
			public string VideoUrl { get; set; }
			public string Notes { get; set; }
		}
	}
}
