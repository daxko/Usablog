using System.Web.Mvc;
using Raven.Client;
using Raven.Client.Linq;
using System.Linq;
using Web.Models;

namespace Web.Controllers
{
	public class StudiesController : Controller
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
									   .ToList();
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

				return RedirectToAction("Index");
			}
			catch
			{
				return View(study);
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
