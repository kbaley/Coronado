using AgileObjects.ReadableExpressions;
using AutoMapper;
using Coronado.Web.Domain;

namespace Coronado.Web.Controllers.Dtos
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Investment, InvestmentForListDto>()
                .ForMember(i => i.LastPrice, opt => opt.MapFrom(src => src.GetLastPrice()))
                .ReverseMap();  
            CreateMap<InvestmentPrice, InvestmentPriceDto>().ReverseMap();  
            CreateMap<InvoiceLineItem, InvoiceLineItemsForPosting>().ReverseMap();
            CreateMap<Invoice, InvoiceForPosting>()
                .ReverseMap()
                .ForMember(dest => dest.Customer, opt => opt.Ignore());

            // Useful for visualizing an AutoMapper mapping
            // var config = new MapperConfiguration(cfg => cfg
            // .CreateMap<InvoiceForPosting, Invoice>()
                // .ForMember(s => s.Customer, opt => opt.Ignore()));
            // var execPlan = config.BuildExecutionPlan(typeof(InvoiceForPosting), typeof(Invoice));
            // var readable = execPlan.ToReadableString();
            // System.Console.WriteLine(readable);
        }
    }    
}
