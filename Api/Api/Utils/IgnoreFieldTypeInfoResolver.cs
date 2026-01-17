using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Api.Models;

namespace Api.Utils;

public class IgnoreType
{
    public Type Type { get; set; }
    public string[] IgnoreFields { get; set; }
}

public class IgnoreFieldTypeInfoResolver(IgnoreType[] ignore): IJsonTypeInfoResolver
{
    public JsonTypeInfo GetTypeInfo(Type type, JsonSerializerOptions options)
    {
        JsonTypeInfo jsonTypeInfo = new DefaultJsonTypeInfoResolver().GetTypeInfo(type, options);

        if (jsonTypeInfo.Kind == JsonTypeInfoKind.Object && ignore.Any(a=>a.Type==jsonTypeInfo.Type))
        {
            var properties = jsonTypeInfo.Properties.Where(p => ignore.First(f=>f.Type==jsonTypeInfo.Type).IgnoreFields.Contains(p.Name) );
            foreach (var property in properties)
            {
                property.ShouldSerialize = (_,_)=>false;
            }
        }

        return jsonTypeInfo;
    }
}