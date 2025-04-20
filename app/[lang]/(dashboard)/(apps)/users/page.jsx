import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react'
import UserTableStatus from '../../(tables)/tailwindui-table/user-table-status';

function page() {
  return (
    <>
      <div className="space-y-20">
        {/* Teachers */}
        <div className=" space-y-6">
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Teachers
              </h3>
            </div>
            <div className="flex-none">
              <Button type="button">Add Teacher</Button>
            </div>
          </div>
          <Card title="Simple">
            <UserTableStatus />
          </Card>
        </div>

        {/* Quality Assurance */}
        <div className=" space-y-6">
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Quality Assurance
              </h3>
            </div>
            <div className="flex-none">
              <Button type="button">Add Quality Assurance</Button>
            </div>
          </div>
          <Card title="Simple">
            <UserTableStatus />
          </Card>
        </div>
      </div>
    </>
  );
}

export default page