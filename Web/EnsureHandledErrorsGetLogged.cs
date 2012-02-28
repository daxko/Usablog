using System.Web.Mvc;
using Elmah;

namespace Web
{
	public class EnsureHandledErrorsGetLogged : IExceptionFilter
	{
		public void OnException(ExceptionContext context)
		{
			// Log only handled exceptions, because all other will be caught by ELMAH anyway.
			if (context.ExceptionHandled)
				ErrorSignal.FromCurrentContext().Raise(context.Exception);
		}
	}
}