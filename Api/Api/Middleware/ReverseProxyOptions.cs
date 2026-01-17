using System;
using System.Collections.ObjectModel;

namespace Api.Middleware;

public class ReverseProxyOptions
{
    private IDictionary<string,string> _include;
    private IList<string> _exclude;

    public ReverseProxyOptions()
    {
        _include = new Dictionary<string, string>();
        _exclude = new List<string>();
    }
    public IDictionary<string, string> Include
    {
        get
        {
            return _include.AsReadOnly();
        }
    }
    public IList<string> Exclude
    {
        get
        {
            return _exclude.AsReadOnly();
        }
    }

    public void AddInclude(string path, string destination)
    {
        _include.Add(path, destination);
    }

    public void AddExclude(string path)
    {
        _exclude.Add(path);
    }

}
