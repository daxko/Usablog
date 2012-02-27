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
			if(IsAuthentic(email, password))
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
			var user = new Authenticator().Create(email, password);
			using (var session = MvcApplication.Store.OpenSession())
			{
				session.Store(user);
				session.SaveChanges();
			}

    		ViewBag.Message = string.Format("Created {0}", email);
    		return View("New");
		}

    	private bool IsAuthentic(string email, string password)
    	{
			var user = FindUser(email);
			if (user == null)
				return false;

    		return new Authenticator().PasswordsMatch(password, user.HashedPassword);
    	}

    	private User FindUser(string email)
		{
			using (var session = MvcApplication.Store.OpenSession())
				return session.Load<User>(Models.User.UserId(email));
		}
    }
}
