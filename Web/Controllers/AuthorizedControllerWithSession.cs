using System.Web.Mvc;
using Raven.Client;

namespace Web.Controllers
{
	[Authorize]
	public class AuthorizedControllerWithSession : Controller
	{
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