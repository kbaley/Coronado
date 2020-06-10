using System;

namespace Coronado.Web.Domain {
    public static class Irr {

        public delegate double fx(double x);

        static fx ComposeFunctions(fx f1, fx f2) {
            return (double x) => f1(x) + f2(x);
        }

        static fx F_xirr(double p, double dt, double dt0) {
            return (double x) => p*Math.Pow((1.0+x),((dt0-dt)/365.0));
        }

        static fx Df_xirr(double p, double dt, double dt0) {
            return (double x) => (1.0/365.0)*(dt0-dt)*p*Math.Pow((x+1.0),(((dt0-dt)/365.0)-1.0));
        }

        static fx Total_f_xirr(double[] payments, double[] days) {
            fx resf = (double x) => 0.0;

            for (var i = 0; i < payments.Length; i++) {
                resf = ComposeFunctions(resf,F_xirr(payments[i],days[i],days[0]));
            }

            return resf;
        }

        static fx Total_df_xirr(double[] payments, double[] days) {
            fx resf = (double x) => 0.0;

            for (var i = 0; i < payments.Length; i++) {
                resf = ComposeFunctions(resf,Df_xirr(payments[i],days[i],days[0]));
            }

            return resf;
        }

        public static double CalculateIrr(double[] cashflow, double[] days) {
            return NewtonsMethod(0.1, Total_f_xirr(cashflow, days), Total_df_xirr(cashflow, days));
        }

        static double NewtonsMethod(double guess, fx f, fx df) {
            var x0 = guess;
            double x1;
            var err = 1e+100;
            var tolerance = 0.001;

            while (err > tolerance) {
                x1 = x0 - f(x0)/df(x0);
                err = Math.Abs(x1-x0);
                x0 = x1;
            }

            return x0;
        }

    }
}
