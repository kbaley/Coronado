using System.Threading.Tasks;

namespace Coronado.ConsoleApp.Commands
{
    public interface ICommand {
        Task Execute(Datastore context, params string[] args);
        bool Matches(string entry);
    }
}
