import React, { useState, useEffect } from "react";
import {
  School as SchoolIcon,
  Users,
  CreditCard,
  TrendingUp,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/helpers";
import { getSchools } from "../services/auth";

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSchools = async () => {
    try {
      setIsLoading(true);

      const response = await getSchools();
      const { data = [] } = response?.data || {};

      setSchools(data);
    } catch (error) {
      toast.error("Failed to load schools data", error.message);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading schools...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Schools
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and view school payment statistics
          </p>
        </div>
        <Button onClick={loadSchools} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Schools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => {

          return (
            <Card
              key={school._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <SchoolIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{school.name}</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {school.email}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Link
                    to={`/transactions?school=${school._id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      View Transactions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {schools.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <SchoolIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              No Schools Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no schools registered in the system yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Schools;
