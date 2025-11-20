using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Api.Models;

namespace Api.Utils;

public class CustomTypeInfoResolver: IJsonTypeInfoResolver
{
    public JsonTypeInfo GetTypeInfo(Type type, JsonSerializerOptions options)
    {
        JsonTypeInfo jsonTypeInfo = new DefaultJsonTypeInfoResolver().GetTypeInfo(type, options);

        if (jsonTypeInfo.Kind == JsonTypeInfoKind.Object && jsonTypeInfo.Type == typeof(Answer))
        {
            var properties = jsonTypeInfo.Properties.Where(p => p.Name == "IsRight");
            foreach (var property in properties)
            {
                property.ShouldSerialize = (_,_)=>false;
            }
        }

        return jsonTypeInfo;
    }
}