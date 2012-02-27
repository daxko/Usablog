using System;
using System.Web.Mvc;
using Raven.Client;
using Web.Models;

namespace Web.Controllers
{
	public class SessionsController : Controller
	{
		//
		// GET: /Sessions/Details/5

		public ActionResult Details(string id)
		{
			var session = DocumentSession.Load<Session>(id);
			return View(session);
		}

		//
		// GET: /Sessions/Create

		public ActionResult Create(string studyId)
		{
			var session = new Session(studyId, String.Empty);
			return View(session);
		} 

		//
		// POST: /Sessions/Create

		[HttpPost]
		public ActionResult Create(string studyId, string name)
		{
			var session = new Session(studyId, name);
			try
			{
				DocumentSession.Store(session);
				DocumentSession.SaveChanges();

				return RedirectToAction("Details", "Studies", new { Id = studyId });
			}
			catch
			{
				return View(session);
			}
		}

		private IDocumentSession _documentSession;
		protected IDocumentSession DocumentSession
		{
			get
			{
				if (_documentSession == null)
				{
					_documentSession = MvcApplication.Store.OpenSession();
				}
				return _documentSession;
			}
		}
	}
}
