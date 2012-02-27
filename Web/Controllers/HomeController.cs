using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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

	public class ErrorsController : Controller
	{
		public ActionResult Index()
		{
			ViewBag.Errors = MvcApplication.Errors;

			return View();
		}
	}
}
