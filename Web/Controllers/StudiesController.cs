using System.Web.Mvc;
using Raven.Client.Linq;
using System.Linq;
using Web.Models;

namespace Web.Controllers
{
	public class StudiesController : AuthorizedControllerWithSession
	{
		//
		// GET: /Studies/

		public ActionResult Index()
		{
			var results = DocumentSession.Query<Study>();
			return View(results);
		}

		//
		// GET: /Studies/Details/5

		public ActionResult Details(string id)
		{
			var study = DocumentSession.Load<Study>(id);
			ViewBag.Sessions = DocumentSession.Query<Session>()
				.Where(x => x.StudyId == id)
				.OrderByDescending(x => x.StartDate)
				.ToList();

			ViewBag.Findings = DocumentSession.Query<Finding>()
				.Where(f => f.StudyId == id);

			return View(study);
		}

		//
		// GET: /Studies/Create

		public ActionResult Create()
		{
			return View(new Study());
		} 

		//
		// POST: /Studies/Create

		[HttpPost]
		public ActionResult Create(string name)
		{
			var study = new Study { Name = name };
			try
			{
				DocumentSession.Store(study);
				DocumentSession.SaveChanges();

				return RedirectToAction("Details", new { id = study.Id });
			}
			catch
			{
				return View(study);
			}
		}

		//
		// GET: /Studies/Create

		public ActionResult Rename(string id)
		{
			var study = DocumentSession.Load<Study>(id);
			return View(study);
		}

		//
		// POST: /Studies/Create

		[HttpPost]
		public ActionResult Rename(string id, string name)
		{
			var study = DocumentSession.Load<Study>(id);
			study.Name = name;

			try
			{
				DocumentSession.SaveChanges();
				return RedirectToAction("Details", new { id });
			}
			catch
			{
				return View(study);
			}
		}
	}
}
