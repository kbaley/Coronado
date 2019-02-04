using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
    public interface IUserRepository
    {
        User GetByEmail(string email); 
    }
}
