using System.Web.Mvc;

namespace Web.Controllers
{
	[Authorize]
	public class HomeController : Controller
	{
		//
		// GET: /Home/

		public ActionResult Index()
		{
			return View();
		}
	}
}
