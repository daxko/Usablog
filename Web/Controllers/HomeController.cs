using System.Web.Mvc;

namespace Web.Controllers
{
	[Authorize]
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			return RedirectToAction("Index", "Studies");
		}
	}
}
