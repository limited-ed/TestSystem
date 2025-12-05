using System;

namespace Api.Models.Options;

// 
    public class NodeServer
    {
        public bool StartNodeServer { get; set; }
        public string Path { get; set; }
    }

    public class Options
    {
        public Dictionary<string,string> Include { get; set; }
        public List<string> Exclude { get; set; }
    }

    public class ReverseProxy
    {
        public bool UseReverseProxy { get; set; }
        public Options Options { get; set; }
    }

    public class SpaServicesOptions
{
        public const string SpaServices = "SpaServices";
        public NodeServer NodeServer { get; set; }
        public ReverseProxy ReverseProxy { get; set; }
    }
