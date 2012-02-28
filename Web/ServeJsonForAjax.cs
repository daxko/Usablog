using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web
{
	/// <summary>
	/// If the request is detected to be an Ajax Json request,
	/// serializes ViewData.Model to an EntityJsonActionResult
	/// </summary>
	public class ServeJsonForAjax : FilterAttribute, IActionFilter
	{
		public void OnActionExecuting(ActionExecutingContext filterContext)
		{

		}

		public void OnActionExecuted(ActionExecutedContext filterContext)
		{
			if (filterContext.Result.IsAlreadyJsonAjaxResult())
				return;

			if (filterContext.HttpContext.Request.IsJsonAjaxRequest())
				filterContext.Result = new EntityJsonActionResult(filterContext.Controller.ViewData.Model);
		}
	}

	public static class JsonAjaxRequestExtensions
	{
		public static bool IsJsonAjaxRequest(this HttpRequestBase request)
		{
			return request.IsAjaxRequest() && request.Headers["accept"].Contains("application/json");
		}

		public static bool IsAlreadyJsonAjaxResult(this ActionResult result)
		{
			var resultType = result.GetType();
			return JsonResultTypes.Any(resultType.IsAssignableFrom);
		}

		private static Type[] JsonResultTypes = new[]
		                                 	{
		                                 		typeof (JsonResult), 
												typeof (JavaScriptResult), 
												typeof (EntityJsonActionResult)
		                                 	};
	}
}