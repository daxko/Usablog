using System.Web.Mvc;
using System.Web.Security;
using Web.Models;

namespace Web.Controllers
{
    public class LoginController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

		[HttpPost]
		public ActionResult Index(string email, string password, string returnUrl)
		{
			if(new Authenticator().IsAuthentic(email, password))
			{
				FormsAuthentication.SetAuthCookie(email, false);
				return SendThemOnTheirWay(returnUrl);
			}

			ViewBag.Email = email;
			ViewBag.ErrorText = "Nope.";
			return Index();
		}

    	public ActionResult Logout()
		{
			FormsAuthentication.SignOut();
			return RedirectToAction("Index");
		}

    	private ActionResult SendThemOnTheirWay(string returnUrl)
		{
    		if (string.IsNullOrEmpty(returnUrl))
    			return RedirectToAction("Index", "Home");

    		return Redirect(returnUrl);
		}

		[Authorize]
		public ActionResult New()
    	{
    		return View();
    	}

		[Authorize]
		public ActionResult Create(string email, string password)
		{
			new Authenticator().Create(email, password);
			FormsAuthentication.SetAuthCookie(email, false);
			return SendThemOnTheirWay(null);
		}
    }
}
