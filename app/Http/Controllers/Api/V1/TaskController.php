<?php

namespace App\Http\Controllers\Api\V1;

use App\Task;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Notifications\TaskStatusUpdated;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**List a tasks
     *
     * @param Illuminate\Http\Request $request
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function index(Request $request) : JsonResponse
    {
        try {
            //cache...
            if($request->has('page')){
                Cache::forget('tasks');
            }
            $tasks = Cache::remember('tasks', 60, function () {
                return Task::with('user')->paginate(10);
            });

            return response()->json($tasks, 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }

    }

    /**
     * Store a task
     *
     * @param Illuminate\Http\Request $request
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function store(Request $request) : JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                "assignedTo" => 'required|exists:users,id',
                'title' => 'required|string',
                'description' => 'required|string',
                'startDate' => 'required|date',
                'endDate' => 'required|date|after:start_date',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
               // return validation error
            }

            $task = new Task();
            $task->user_id = $request->assignedTo;
            $task->title = $request->title;
            $task->description = $request->description;
            $task->start_date = $request->startDate;
            $task->end_date = $request->endDate;
            $task->status = 'pending';
            $task->save();
            Cache::forget('tasks');
            return response()->json(['data'=>$task, 'message' => 'Task created successfully','status'=>'201'], 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 500);
        }

    }

    /**
     * Show a task
     *
     * @param Illuminate\Http\Request $request
     * @param App\Task $task
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function show(Request $request, Task $task) : JsonResponse
    {
        try {
            //code..
            $task = Task::with('user')->find($task->id);

            return response()->json($task, 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }

    }

    /**
     * Update a task
     *
     * @param Illuminate\Http\Request $request
     * @param App\Task $task
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Task $task) : JsonResponse
    {
        try {
          // Gelen verilerle mevcut verileri birleştiriyoruz
        $data = array_merge([
            'assignedTo' => $task->user_id,
            'title' => $task->title,
            'description' => $task->description,
            'startDate' => $task->start_date,
            'endDate' => $task->end_date,
            'status' => $task->status,
        ], array_filter($request->all())); // Gelen verileri mevcut verilerle birleştiriyoruz

        // Verileri doğruluyoruz
        $validator = Validator::make($data, [
            "assignedTo" => 'required|exists:users,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after:startDate',
            'status' => 'required|string',
        ]);

        // Doğrulama hatası varsa
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
         // Durum değiştiyse bildirim gönder
         if ($task->status !== $data['status']) {
            $user = User::find($data['assignedTo']);
            if ($user) {
                $user->notify(new TaskStatusUpdated($task)); // Bildirim gönderme
            }
        }

        // Görev güncellemeleri
        $task->user_id = $data['assignedTo'];
        $task->title = $data['title'];
        $task->description = $data['description'];
        $task->start_date = $data['startDate'];
        $task->end_date = $data['endDate'];
        $task->status = $data['status'];
        $task->save();
        Cache::forget('tasks');
            return response()->json(['data'=>$task, 'message' => 'Task updated successfully','status'=>'200'], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }

    }
    /**
     * Delete a task
     *
     * @param Illuminate\Http\Request $request
     * @param App\Task $task
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, Task $task) : JsonResponse
    {
        try {
            //code...
            $task->delete();
            Cache::forget('tasks');
            return response()->json(['message' => 'Task deleted successfully','status'=>'200'], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }

    }

}
