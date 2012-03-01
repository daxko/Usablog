using System;
using System.Collections.Generic;
using System.IO;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace Web
{
	public class EntityJsonActionResult : ActionResult
	{
		private readonly object _value;

		public EntityJsonActionResult(object value)
		{
			_value = value;
		}

		public override void ExecuteResult(ControllerContext context)
		{
			context.HttpContext.Response.ContentType = "application/json";

			using (var writer = new StreamWriter(context.HttpContext.Response.OutputStream))
			{
				try
				{
					Serialize(writer, _value);
				}
				catch (System.Exception exception)
				{
					context.HttpContext.Response.ClearContent();
					context.HttpContext.Response.StatusCode = 500;
					Serialize(writer, exception);
				}
			}
		}

		public void Serialize(TextWriter writer, object value)
		{
			var settings = new JsonSerializerSettings
							{
								ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver(),
								Converters = new List<JsonConverter> { new GeneralJsonEnumConverter() }
							};
			var serializer = JsonSerializer.Create(settings);

			serializer.Serialize(writer, value);
		}
	}

	public class GeneralJsonEnumConverter : JsonConverter
	{
		public override bool CanConvert(Type objectType)
		{
			return objectType.IsEnum;
		}

		public override void WriteJson(JsonWriter writer, object
		value, JsonSerializer serializer)
		{
			writer.WriteValue(value.ToString());
		}

		public override object ReadJson(JsonReader reader, Type
		objectType, object existingValue, JsonSerializer serializer)
		{
			return Enum.Parse(objectType, reader.Value.ToString());
		}
	}
}