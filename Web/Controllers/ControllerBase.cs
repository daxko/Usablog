using System.Web.Mvc;
using Raven.Client;

namespace Web.Controllers
{
	public class ControllerBase : Controller
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